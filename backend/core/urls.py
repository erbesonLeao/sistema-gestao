# backend/core/urls.py (o principal do projeto) - VERSÃO FINAL E CORRETA

from django.contrib import admin
from django.urls import path, include 

urlpatterns = [
    # AQUI ESTÁ A LINHA CRÍTICA QUE ESTAVA FALTANDO OU INCORRETA:
    # Ela habilita o painel de administração padrão do Django.
    path('admin/', admin.site.urls),

    # Rota principal que agrupa TODAS as URLs da nossa API sob o prefixo /api/
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