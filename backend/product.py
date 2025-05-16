import base64
import re
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


def serialize_product(product):
    if isinstance(product["imagem"], bytes):
        product["imagem"] = base64.b64encode(product["imagem"]).decode()
    return product


@product_bp.route("/", methods=["GET"])
def get_all_products():
    products = get_products()
    products = [serialize_product(product) for product in products]
    return jsonify({"products": products}), 200


@product_bp.route("/seller/<int:fk_seller>", methods=["GET"])
def get_all_products_by_seller(fk_seller):
    products = get_products_by_seller(fk_seller)
    products = [serialize_product(product) for product in products]
    return jsonify({"products": products}), 200


@product_bp.route("/<int:id>", methods=["GET"])
def get_product_by_id(id):
    product = get_product(id)
    if product:
        product = serialize_product(product)
    else:
        return jsonify({"message": "Produto não encontrado"}), 404
    return jsonify({"product": product}), 200


@product_bp.route("/", methods=["POST"])
def create():
    if request.is_json:
        request_data = request.get_json()
        image = request_data.get("image")
        price = request_data.get("price")
        count = request_data.get("count")
        name = request_data.get("name")
        fk_seller = request_data.get("fk_seller", "")
        description = request_data.get("description", "")
        image = request_data.get("image")
    else:
        price = request.form.get("price")
        count = request.form.get("count")
        name = request.form.get("name")
        description = request.form.get("description", "")
        fk_seller = request.form.get("fk_seller", "")
        image_file = request.files.get("image")
        image = image_file.read() if image_file else None
    if all([count, name, price, description, fk_seller]):
        if register_product(name, price, count, description, fk_seller, image):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não registrado"}, 401


@product_bp.route("/<int:id>", methods=["PUT"])
def update(id):
    if request.is_json:
        request_data = request.get_json()
        price = request_data.get("price")
        count = request_data.get("count")
        name = request_data.get("name")
        description = request_data.get("description", "")
        image = None
    else:
        image = request.form.get("image")
        price = request.form.get("price")
        count = request.form.get("count")
        name = request.form.get("name")
        description = request.form.get("description", "")
        image_file = request.files.get("image")
        image = image_file.read() if image_file else None
    if count or name or price or description:
        if update_product(id, name, price, count, description, image):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não pode ser atualizado"}, 401


@product_bp.route("/<int:id>", methods=["DELETE"])
def remove(id):
    if id:
        if delete_product(id):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não pode ser deletado"}, 401
