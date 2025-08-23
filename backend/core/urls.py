# backend/core/urls.py - VERSÃO REATORADA E CORRETA

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Rota para o painel de administração do Django
    path('admin/', admin.site.urls),

    # Rota principal que agrupa todas as URLs da nossa API
    # Todas as nossas URLs de apps estarão dentro de /api/
    path('api/', include([
        path('usuarios/', include('usuarios.urls')),
        path('funcionarios/', include('funcionarios.urls')),
        path('maquinario/', include('maquinario.urls')),
        path('estoque/', include('estoque.urls')),
        path('financeiro/', include('financeiro.urls')),
        path('dashboard/', include('dashboard.urls')),
        # Futuramente, adicionaremos a app 'core' aqui para as notificações
    ])),
]