# backend/financeiro/urls.py - VERSÃO CORRIGIDA

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaFinanceiraViewSet, CentroDeCustoViewSet, 
    LancamentoFinanceiroViewSet, ExportLancamentosCSVView
)

router = DefaultRouter()
router.register(r'categorias', CategoriaFinanceiraViewSet)
router.register(r'centros-de-custo', CentroDeCustoViewSet)
router.register(r'lancamentos', LancamentoFinanceiroViewSet)

urlpatterns = [
    # AQUI ESTÁ A MUDANÇA: Colocamos nossa URL customizada de forma mais específica
    # A URL completa agora será /api/financeiro/lancamentos/export/csv/
    path(
        'lancamentos/export/csv/', 
        ExportLancamentosCSVView.as_view(), 
        name='export-lancamentos-csv'
    ),

    # As rotas padrão do router vêm depois
    path('', include(router.urls)),
]