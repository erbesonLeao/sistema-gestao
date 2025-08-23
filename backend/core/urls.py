# backend/core/urls.py (o principal do projeto) - VERSÃO COM IMPORT CORRIGIDO

from django.contrib import admin
# AQUI ESTÁ A CORREÇÃO: Adicionamos 'include' à importação
from django.urls import path, include 

urlpatterns = [
    # Rota para o painel de administração do Django
    path('admin/', admin.site.urls),

    # Rota principal que agrupa TODAS as URLs da nossa API sob o prefixo /api/
    path('api/', include([
        # Incluímos as URLs da app 'core' (notificações) no caminho /api/core/
        path('core/', include('core.urls')),
        
        # Incluímos as outras apps, cada uma com seu prefixo
        path('usuarios/', include('usuarios.urls')),
        path('funcionarios/', include('funcionarios.urls')),
        path('maquinario/', include('maquinario.urls')),
        path('estoque/', include('estoque.urls')),
        path('financeiro/', include('financeiro.urls')),
        path('dashboard/', include('dashboard.urls')),
    ])),
]