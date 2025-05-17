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


def get_user(id, type_user: Literal["clientes", "vendedores"]):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = f"SELECT * FROM {type_user} WHERE id = %s"
            cursor.execute(query, (id,))
            result = cursor.fetchone()
            return result


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
                return result["id"]
            print("usuario nao autenticado")
            return 0


def register_user(name, email, password, type_user: Literal["clientes", "vendedores"]):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = f"INSERT INTO {type_user} (nome,email,senha) VALUES (%s,%s,%s)"
                cursor.execute(query, (name, email, password))
                conn.commit()
                print(f"usuario {email} - {name} registrado")
                return cursor.lastrowid
            except Exception as e:
                print(e)
                conn.rollback()
                print("usuario nao pode ser registrado")
                return 0


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
            query = "SELECT * FROM produtos "
            cursor.execute(query)
            result = cursor.fetchall()
            return result


def get_products_by_seller(fk_seller):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = "SELECT * FROM produtos WHERE fk_vendedor = %s"
            cursor.execute(query, (fk_seller,))
            result = cursor.fetchall()
            return result


def get_product(id_):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            query = "SELECT * FROM produtos WHERE id = %s"
            cursor.execute(query, (id_,))
            result = cursor.fetchone()
            return result


def register_product(name, price, count, description, fk_seller, image=None):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                if image is not None:
                    print("com imagem")
                    query = "INSERT INTO produtos (nome,preco,quantidade,descricao,fk_vendedor,imagem) VALUES (%s,%s,%s,%s,%s,%s)"
                    cursor.execute(
                        query, (name, price, count, description, fk_seller, image)
                    )
                else:
                    print("sem imagem")
                    query = "INSERT INTO produtos (nome,preco,quantidade,descricao,fk_vendedor) VALUES (%s,%s,%s,%s,%s)"
                    cursor.execute(query, (name, price, count, description, fk_seller))
                conn.commit()
                print(f"produto {name} registrado")
                return True
            except Exception as e:
                print(e)
                conn.rollback()
                print("produto nao pode ser registrado")
                return False


def update_product(id_, name, price, count, description, image=None):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            try:
                if image is not None:
                    print("com imagem")
                    query = "UPDATE produtos SET nome =%s,preco=%s,quantidade=%s,descricao=%s,imagem=%s WHERE id = %s"
                    cursor.execute(query, (name, price, count, description, image, id_))
                else:
                    print("sem imagem")
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


def get_buys(fk_user):
    with get_connection() as conn:
        with conn.cursor() as cursor:

            query = """SELECT c.id,c.data_compra,c.quantidade,
            c.fk_usuario,c.fk_produto, 
            p.nome,p.preco,p.quantidade as p_quantidade,p.descricao,p.fk_vendedor,p.id as p_id, p.imagem
            FROM compras c JOIN produtos p
            ON c.fk_produto = p.id  WHERE fk_usuario = %s"""
            cursor.execute(query, (fk_user,))
            result = cursor.fetchall()
            return result
