import os  # Necessary for pulling ENV VARIABLES

DEFAULT_PORT = 5432

class Config():
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

class LocalConfig(Config):
    SECRET_KEY = 'asdjdhfowefuihvnlksjngolejrngo348y5'
    TYPE = 'local'
    ENV = 'development'
    DEBUG = True

class ProductionConfig(Config):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    TYPE = 'prod'
    ENV = 'production'
    DEBUG = False