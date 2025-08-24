# backend/core/urls.py (para a app 'core') - ADICIONANDO ROTA DO DASHBOARD

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificacaoViewSet, DashboardSummaryView # Importamos a view do Dashboard

router = DefaultRouter()
router.register(r'notificacoes', NotificacaoViewSet, basename='notificacao')

urlpatterns = [
    # Adicionamos a rota do dashboard aqui
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    
    # As rotas de notificação continuam aqui
    path('', include(router.urls)),
]