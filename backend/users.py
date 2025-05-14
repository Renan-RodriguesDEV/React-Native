from flask import Blueprint, jsonify, request
from db_actions import register_user, login, update_user, delete_user, get_users
from token_gen import token_gen

users_bp = Blueprint("user", __name__)


@users_bp.route("/", methods=["POST"])
def create():
    request_data = request.get_json()
    email = request_data.get("email")
    password = request_data.get("password")
    name = request_data.get("name")
    type_user = request.args.get("type_user")
    if all([email, password, name]):
        if register_user(name, email, password, type_user):
            return jsonify({"message": "sucess", "token": token_gen()}), 201
    return {"message": "Usuario não registrado"}, 401


@users_bp.route("/<int:id>", methods=["PUT"])
def update(id):
    request_data = request.get_json()
    name = request_data.get("name")
    email = request_data.get("email")
    password = request_data.get("password")
    type_user = request.args.get("type_user")
    if email or name or password:
        if update_user(id, name, email, password, type_user):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Usuario não pode ser atualizado"}, 401


@users_bp.route("/<int:id>", methods=["DELETE"])
def remove(id):
    type_user = request.args.get("type_user")
    if id:
        if delete_user(id, type_user):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Usuario não pode ser deletado"}, 401


@users_bp.route("/", methods=["GET"])
def get_all_users():
    type_user = request.args.get("type_user")
    if type_user:
        return jsonify({"users": get_users(type_user)}), 200
    return {"message": "Tipo de usuario não informado"}, 401


@users_bp.route("/login", methods=["POST"])
def auth_user():
    request_data = request.get_json()
    email = request_data.get("email")
    password = request_data.get("password")
    type_user = request.args.get("type_user")
    if all([email, password, type_user]):
        if login(email, password, type_user):
            return jsonify({"message": "sucess", "token": token_gen()}), 200
    return {"message": "usuario não autenticado"}, 401
