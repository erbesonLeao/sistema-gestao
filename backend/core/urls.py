# backend/core/urls.py - VERSÃO COMPLETA E ATUALIZADA PARA DEPLOY NO RENDER

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Rota para o painel de administração do Django
    path('admin/', admin.site.urls),

    # Rotas da API agrupadas sob o prefixo 'api/'
    path('api/', include([
        path('', include('usuarios.urls')),
        path('', include('funcionarios.urls')),
        path('', include('maquinario.urls')),
        path('', include('estoque.urls')),
        path('', include('financeiro.urls')),
        path('dashboard/', include('dashboard.urls')),
        # Rotas de autenticação JWT
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ])),

    # Opcional: Adicione uma rota para documentação da API (ex.: drf-spectacular)
    # Exemplo: path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
]