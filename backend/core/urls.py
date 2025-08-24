# backend/core/urls.py (o principal do projeto) - VERSÃO FINALÍSSIMA

from django.contrib import admin
from django.urls import path, include 

# 1. Importamos as Views de Token do SimpleJWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # 2. AQUI ESTÃO AS ROTAS DE LOGIN E REFRESH QUE FALTAVAM
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rota principal que agrupa todas as outras URLs da nossa API
    path('api/', include([
        path('core/', include('core.urls')),
        path('usuarios/', include('usuarios.urls')),
        path('funcionarios/', include('funcionarios.urls')),
        path('maquinario/', include('maquinario.urls')),
        path('estoque/', include('estoque.urls')),
        path('financeiro/', include('financeiro.urls')),
        path('dashboard/', include('dashboard.urls')),
    ])),
]