import os  # Necessary for pulling ENV VARIABLES

DEFAULT_PORT = 5432

class Config():
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

class LocalConfig(Config):
    SECRET_KEY = 'change-this-in-prod'
    TYPE = 'local'
    ENV = 'development'
    DEBUG = True
    HASH_SALT = 'change-this-in-prod'

class ProductionConfig(Config):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    TYPE = 'prod'
    ENV = 'production'
    DEBUG = False
    HASH_SALT = os.environ.get('HASH_SALT')