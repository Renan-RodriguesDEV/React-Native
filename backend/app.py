from flask import Flask
from flask_cors import CORS
from users import users_bp
from product import product_bp
from purchases import purchase_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(users_bp, url_prefix="/user")
app.register_blueprint(product_bp, url_prefix="/product")
app.register_blueprint(purchase_bp, url_prefix="/purchases")


@app.route("/", methods=["GET"])
def hello():
    return "<html><h1>API is running!! - Sr. Dr. Me. Shogun Renan</h1></html>"


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)
