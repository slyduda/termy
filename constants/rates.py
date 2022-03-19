from datetime import timedelta
import os

IS_PROD = os.environ.get('ENV_TYPE') == 'prod'

SubmitRate = (5, timedelta(minutes=30)) if IS_PROD else (100, timedelta(minutes=30))
CatchupRate = (5, timedelta(minutes=30)) if IS_PROD else (100, timedelta(minutes=30))
StaticRate = (5, timedelta(minutes=1)) if IS_PROD else (100, timedelta(minutes=30))
IndexRate = (5, timedelta(minutes=1)) if IS_PROD else (100, timedelta(minutes=30))