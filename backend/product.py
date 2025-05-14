from flask import Blueprint, jsonify, request
from db_actions import (
    register_buy,
    register_product,
    update_product,
    delete_product,
    get_product,
    get_products,
)

product_bp = Blueprint("product", __name__)


@product_bp.route("/", methods=["GET"])
def get_all_products():
    return jsonify({"products": get_products()}), 200


@product_bp.route("/<int:id>", methods=["GET"])
def get_product_by_id(id):
    print(id)
    return jsonify({"product": get_product(id)}), 200


@product_bp.route("/", methods=["POST"])
def create():
    request_data = request.get_json()
    price = request_data.get("price")
    count = request_data.get("count")
    name = request_data.get("name")
    description = request_data.get("description", "")
    if all([count, name, price, description]):
        if register_product(name, price, count, description):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não registrado"}, 401


@product_bp.route("/<int:id>", methods=["PUT"])
def update(id):
    request_data = request.get_json()
    price = request_data.get("price")
    count = request_data.get("count")
    name = request_data.get("name")
    description = request_data.get("description", "")
    if count or name or price or description:
        if update_product(id, name, price, count, description):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não pode ser atualizado"}, 401


@product_bp.route("/<int:id>", methods=["DELETE"])
def remove(id):
    if id:
        if delete_product(id):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não pode ser deletado"}, 401


@product_bp.route("/buy", methods=["POST"])
def buy():
    request_data = request.get_json()
    fk_produto = request_data.get("fk_produto")
    fk_usuario = request_data.get("fk_usuario")
    count = request_data.get("count")
    if all([fk_produto, fk_usuario, count]):
        if register_buy(fk_produto, fk_usuario, count):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Compra não registrada"}, 401
