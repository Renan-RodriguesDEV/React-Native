from flask import Blueprint, jsonify, request

from db_actions import get_buys, register_buy

purchase_bp = Blueprint("buy", __name__)


@purchase_bp.route("/", methods=["POST"])
def buy():
    request_data = request.get_json()
    fk_produto = request_data.get("fk_produto")
    fk_usuario = request_data.get("fk_usuario")
    count = request_data.get("count")
    if all([fk_produto, fk_usuario, count]):
        if register_buy(fk_produto, fk_usuario, count):
            return jsonify({"message": "sucess"}), 201
    return {"message": "Compra não registrada"}, 401


@purchase_bp.route("/<int:fk_user>", methods=["GET"])
def get_all_buys(fk_user):
    buys = get_buys(fk_user)
    if not buys:
        return jsonify({"message": "Nenhuma compra encontrada"}), 404
    return jsonify({"buys": buys}), 200
