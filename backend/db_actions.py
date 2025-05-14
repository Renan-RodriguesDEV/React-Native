import pymysql
from typing import Literal


def get_connection():
    config = {
        "host": "localhost",
        "user": "root",
        "password": "",
        "database": "storeapp",
        "charset": "utf8mb4",
        "cursorclass": pymysql.cursors.DictCursor,
    }
    return pymysql.connect(**config)


def get_users(type_user: Literal["clientes", "vendedores"]):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = f"SELECT * FROM {type_user}"
            cursor.execute(query)
            result = cursor.fetchall()
            return result


def login(email, password, type_user: Literal["clientes", "vendedores"]):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = f"SELECT * FROM {type_user} WHERE email = %s AND senha = %s"
            cursor.execute(query, (email, password))
            result = cursor.fetchone()
            if result:
                print(f"usuario {email} autenticado")
                return True
            print("usuario nao autenticado")
            return False


def register_user(name, email, password, type_user: Literal["clientes", "vendedores"]):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = f"INSERT INTO {type_user} (nome,email,senha) VALUES (%s,%s,%s)"
                cursor.execute(query, (name, email, password))
                conn.commit()
                print(f"usuario {email} - {name} registrado")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("usuario nao pode ser registrado")
                return False


def update_user(
    id_, nome, email, password, type_user: Literal["clientes", "vendedores"]
):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = f"UPDATE {type_user} SET nome = %s, email = %s, senha = %s WHERE id = %s"
                cursor.execute(query, (nome, email, password, id_))
                conn.commit()
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("usuario nao pode ser atualizado")
                return False


def delete_user(id_, type_user: Literal["clientes", "vendedores"]):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = f"DELETE FROM {type_user} WHERE id = %s"
                cursor.execute(query, (id_,))
                conn.commit()
                print("usuario deletado")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("usuario nao pode ser deletado")
                return False


def get_products():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = "SELECT * FROM produtos"
            cursor.execute(query)
            result = cursor.fetchall()
            return result


def get_product(id_):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = "SELECT * FROM produtos WHERE id = %s"
            cursor.execute(query, (id_,))
            result = cursor.fetchone()
            return result


def register_product(name, price, count, description):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = "INSERT INTO produtos (nome,preco,quantidade,descricao) VALUES (%s,%s,%s,%s)"
                cursor.execute(query, (name, price, count, description))
                conn.commit()
                print(f"produto {name} registrado")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("produto nao pode ser registrado")
                return False


def update_product(id_, name, price, count, description):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = "UPDATE produtos SET nome =%s,preco=%s,quantidade=%s,descricao=%s WHERE id = %s"
                cursor.execute(query, (name, price, count, description, id_))
                conn.commit()
                print(f"produto {name} atualizado")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("produto nao pode ser atualizado")
                return False


def delete_product(id_):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = "DELETE FROM produtos WHERE id = %s"
                cursor.execute(query, (id_,))
                conn.commit()
                print("produto deletado")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("produto nao pode ser deletado")
                return False


def register_buy(fk_product, fk_user, count):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = "INSERT INTO compras (fk_produto,fk_usuario,quantidade) VALUES (%s,%s,%s)"
                cursor.execute(query, (fk_product, fk_user, count))
                conn.commit()
                print("compra registrada")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("compra nao pode ser registrada")
                return False
