# backend/estoque/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet # Importamos a ViewSet de produtos

router = DefaultRouter()
# O modelo principal da app de estoque provavelmente é 'Produto', então a ViewSet deve ter esse nome.
router.register(r'', ProdutoViewSet, basename='produto')

urlpatterns = [
    path('', include(router.urls)),
]