from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)
config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "mobile_usuarios",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


def auth_user(email, senha):
    with pymysql.connect(**config) as conn:
        with conn.cursor() as cursor:
            query = "SELECT email, senha FROM usuarios WHERE email = %s AND senha = %s"
            cursor.execute(query, (email, senha))
            result = cursor.fetchone()
            print(f"Query: {query}")
            print(f"Parâmetros: {email}, {senha}")
            print(f"Resultado: {result}")
            if result:
                return True
            return False


def insert_user(nome, telefone, email, senha):
    QUERY = "insert into usuarios(nome,telefone,email,senha) values (%s,%s,%s,%s);"
    with pymysql.connect(**config) as conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(QUERY, (nome, telefone, email, senha))
                conn.commit()
                return True
        except Exception as e:
            print(e)
            return False


def delete_user(id):
    QUERY = "DELETE FROM usuarios WHERE id = %s"
    with pymysql.connect(**config) as conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(QUERY, (id,))
                conn.commit()
                print("usuario deletado")
                return True
        except Exception as e:
            print(e)
            print("usuario não pode ser deletado")
            return False


def update_user(id, nome, telefone, email, senha):
    QUERY = "UPDATE usuarios SET nome = %s, telefone =%s, email = %s,senha =%s WHERE id = %s"
    with pymysql.connect(**config) as conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(QUERY, (nome, telefone, email, senha, id))
                conn.commit()
                return True
            print("usuario atualizado")
        except Exception as e:
            print(e)
            print("usuario não pode ser atualizado")
            return False


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    senha = data["senha"]
    print(email, senha)
    if auth_user(email, senha):
        return jsonify({"message": "sucess"}), 200
    return jsonify({"message": "error"}), 401


@app.route("/", methods=["GET"])
def fetch_users():
    with pymysql.connect(**config) as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM usuarios",
            )
            result = cursor.fetchall()
            return jsonify(result), 200


@app.route("/", methods=["POST"])
def insert():
    data = request.get_json()
    nome, telefone, email, senha = (
        data["nome"],
        data["telefone"],
        data["email"],
        data["senha"],
    )
    if not nome or not telefone or not email or not senha:
        return jsonify({"message": "error"}), 400
    if insert(nome, telefone, email, senha):
        return jsonify({"message": "sucess"}), 200
    return jsonify({"message": "error"}), 400


@app.route("/<int:id>", methods=["DELETE"])
def delete(id):
    if delete_user(id):
        return jsonify({"message": "sucess"}), 200
    return jsonify({"message": "error"}), 400


@app.route("/<int:id>", methods=["PUT"])
def update(id):
    data = request.get_json()
    nome, telefone, email, senha = (
        data["nome"],
        data["telefone"],
        data["email"],
        data["senha"],
    )
    if not nome or not telefone or not email or not senha:
        return jsonify({"message": "error"}), 400
    if update_user(id, nome, telefone, email, senha):
        return jsonify({"message": "sucess"}), 200
    return jsonify({"message": "error"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
