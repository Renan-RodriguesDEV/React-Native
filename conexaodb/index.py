from flask import Flask
import pymysql

app = Flask(__name__)

config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "react_native_db",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


@app.route("/")
def hello():
    with pymysql.connect(**config) as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mensagens")
            return cursor.fetchall()


if __name__ == "__main__":
    app.run(host="0.0.0.0")
