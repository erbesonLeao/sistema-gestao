# backend/core/urls.py (o da app 'core') - VERSÃO FINAL E COMPLETA

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificacaoViewSet # 1. Importamos a nossa ViewSet

router = DefaultRouter()

# 2. Registramos a ViewSet no router para criar as URLs automaticamente
router.register(r'notificacoes', NotificacaoViewSet, basename='notificacao')

urlpatterns = [
    # Inclui as URLs geradas pelo router (ex: /api/core/notificacoes/)
    path('', include(router.urls)),
]