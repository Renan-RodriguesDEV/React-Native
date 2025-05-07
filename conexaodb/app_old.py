from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)
config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "react_native_db",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


@app.route(
    "/",
    methods=[
        "GET",
    ],
)
def consultas():
    with pymysql.connect(**config) as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mensagens")
            return cursor.fetchall()


@app.route("/", methods=["POST", "PUT", "DELETE"])
def mudancas():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    match request.method:
        case "POST":
            with pymysql.connect(**config) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        "INSERT INTO mensagens (texto) VALUES (%s)", (data["texto"],)
                    )
                    conn.commit()
                    return jsonify({"message": "Inserted successfully"}), 201
        case "PUT":
            with pymysql.connect(**config) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        "UPDATE mensagens SET texto = %s WHERE id = %s",
                        (data["texto"], data["id"]),
                    )
                    conn.commit()
                    return jsonify({"message": "Updated successfully"}), 200
        case "DELETE":
            with pymysql.connect(**config) as conn:
                with conn.cursor() as cursor:
                    cursor.execute("DELETE FROM mensagens WHERE id = %s", (data["id"]))
                    conn.commit()
                    return jsonify({"message": "Deleted successfully"}), 200
    return jsonify({"error": "Invalid method"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
