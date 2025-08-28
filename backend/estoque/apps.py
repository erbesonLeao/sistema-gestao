# backend/estoque/apps.py

from django.apps import AppConfig

class EstoqueConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'estoque'

    # Este método é chamado quando a aplicação carrega.
    def ready(self):
        # Importamos os sinais aqui para garantir que eles sejam registrados ("ligados").
        import estoque.signals