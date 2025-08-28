# backend/core/apps.py

from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    # Este método garante que nossos "ouvintes" (handlers) sejam
    # registrados e fiquem prontos para receber os sinais.
    def ready(self):
        import core.handlers