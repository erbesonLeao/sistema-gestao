# backend/financeiro/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaFinanceiraViewSet, CentroDeCustoViewSet, LancamentoFinanceiroViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaFinanceiraViewSet)
router.register(r'centros-de-custo', CentroDeCustoViewSet)
router.register(r'lancamentos', LancamentoFinanceiroViewSet)

urlpatterns = [
    path('', include(router.urls)),
]