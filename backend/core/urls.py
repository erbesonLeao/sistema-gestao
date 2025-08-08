# backend/core/urls.py - VERSÃO COMPLETA E CORRIGIDA

from django.contrib import admin
from django.urls import path, include

# Importamos as views do Simple JWT para o login
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rotas da API para os nossos módulos
    path('api/', include('usuarios.urls')),
    path('api/', include('funcionarios.urls')),
    path('api/', include('maquinario.urls')),
    path('api/', include('estoque.urls')),
    path('api/', include('financeiro.urls')),
    path('api/dashboard/', include('dashboard.urls')),

    # Rotas de Token/Login (as que estavam em falta)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]