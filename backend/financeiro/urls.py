# backend/financeiro/urls.py - VERSÃO ATUALIZADA COM ROTA DE EXPORTAÇÃO

from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Importamos nossa nova view de exportação
from .views import (
    CategoriaFinanceiraViewSet, CentroDeCustoViewSet, 
    LancamentoFinanceiroViewSet, ExportLancamentosCSVView
)

router = DefaultRouter()
router.register(r'categorias', CategoriaFinanceiraViewSet)
router.register(r'centros-de-custo', CentroDeCustoViewSet)
router.register(r'lancamentos', LancamentoFinanceiroViewSet)

urlpatterns = [
    # Rotas padrão da API para CRUD (Criar, Ler, Atualizar, Apagar)
    path('', include(router.urls)),

    # AQUI ESTÁ A NOSSA NOVA ROTA DE EXPORTAÇÃO
    # A URL completa será /api/financeiro/export/csv/
    path(
        'export/csv/', 
        ExportLancamentosCSVView.as_view(), 
        name='export-lancamentos-csv'
    ),
]