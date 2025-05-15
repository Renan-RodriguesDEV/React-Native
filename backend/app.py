from flask import Flask, request, jsonify
from flask_cors import CORS
from users import users_bp
from product import product_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(users_bp, url_prefix="/user")
app.register_blueprint(product_bp, url_prefix="/product")


@app.route("/", methods=["GET"])
def hello():
    return "API is running!! - Sr. Dr. Me. Shogun Renan"


if __name__ == "__main__":
    app.run(debug=True,port=5001)
