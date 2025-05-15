from flask import Blueprint, jsonify, request
from db_actions import (
    get_products_by_seller,
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


@product_bp.route("/seller/<int:fk_seller>", methods=["GET"])
def get_all_products_by_seller(fk_seller):
    return jsonify({"products": get_products_by_seller(fk_seller)}), 200


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
    fk_seller = request_data.get("fk_seller", "")
    if all([count, name, price, description, fk_seller]):
        if register_product(name, price, count, description, fk_seller):
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
