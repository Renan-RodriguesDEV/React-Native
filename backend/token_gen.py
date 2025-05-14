import secrets


def token_gen():
    return secrets.token_hex(16)
