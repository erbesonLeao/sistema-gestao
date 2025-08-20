# backend/usuarios/urls.py - VERSÃO ATUALIZADA

from django.urls import path
from .views import RegistroView, CurrentUserView # Importamos nossa nova view

urlpatterns = [
    # Rota para criar um novo usuário (pública)
    path('registro/', RegistroView.as_view(), name='registro'),

    # Rota para buscar os dados do usuário logado (protegida)
    # É esta que o nosso frontend vai chamar
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
]