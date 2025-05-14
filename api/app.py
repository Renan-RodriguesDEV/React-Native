import email
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/login", methods=["POST"])
def auth_user():
    request_data = request.get_json()
    email = request_data.get("email")
    password = request_data.get("password")
    if email == "admin" and password == "admin":
        return jsonify({"message": "sucess", "token": "1234"}), 200
    return {"message": "usuario não autenticado"}, 401


@app.route("/", methods=["GET"])
def hello():
    return {"message": "usuario seja bem vindo"}, 200


@app.post("/user", methods=["POST"])
def register_user():
    request_data = request.get_json()
    email = request_data.get("email")
    password = request_data.get("password")
    name = request_data.get("name")
    if all([email, password, name]):
        return jsonify({"message": "sucess", "token": "1234"}), 201
    return {"message": "Usuario não registrado"}, 401


@app.post("/product", methods=["POST"])
def register_product():
    request_data = request.get_json()
    price = request_data.get("price")
    count = request_data.get("count")
    name = request_data.get("name")
    description = request_data.get("description", "")
    if all([email, count, name, price, description]):
        return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não registrado"}, 401


@app.put("/product/<int:id>", methods=["PUT"])
def update_product():
    request_data = request.get_json()
    price = request_data.get("price")
    count = request_data.get("count")
    name = request_data.get("name")
    description = request_data.get("description", "")
    if email or count or name or price or description:
        return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não pode ser atualizado"}, 401


@app.put("/user/<int:id>", methods=["PUT"])
def update_user():
    request_data = request.get_json()
    name = request_data.get("name")
    email = request_data.get("email")
    password = request_data.get("password")
    if email or name or password:
        return jsonify({"message": "sucess"}), 201
    return {"message": "Usuario não pode ser atualizado"}, 401


@app.delete("/product/<int:id>", methods=["POST"])
def delete_product(id_):
    if id_:
        return jsonify({"message": "sucess"}), 201
    return {"message": "Produdo não pode ser deletado"}, 401


@app.delete("/user/<int:id>", methods=["POST"])
def delete_user(id_):
    if id_:
        return jsonify({"message": "sucess"}), 201
    return {"message": "Usuario não pode ser deletado"}, 401


if __name__ == "__main__":
    app.run(debug=True, port=5001)
