# backend/core/urls.py (o principal do projeto) - VERSÃO FINAL SIMPLIFICADA E SEGURA

from django.contrib import admin
from django.urls import path, include 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Rota do Admin
    path('admin/', admin.site.urls),

    # Rotas de Token (Login)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rotas de cada App, agora listadas individualmente para máxima clareza
    path('api/core/', include('core.urls')),
    path('api/usuarios/', include('usuarios.urls')),
    path('api/funcionarios/', include('funcionarios.urls')),
    path('api/maquinario/', include('maquinario.urls')),
    path('api/estoque/', include('estoque.urls')),
    path('api/financeiro/', include('financeiro.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]