# backend/app.py
import serverless_wsgi
from core.wsgi import application

def handler(event, context):
    return serverless_wsgi.handle(application, event, context)