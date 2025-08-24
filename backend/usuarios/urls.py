# backend/usuarios/urls.py

from django.urls import path
from .views import RegistroView, CurrentUserView

urlpatterns = [
    # Rota para criar um novo usuário (pública)
    path('registro/', RegistroView.as_view(), name='registro'),

    # Rota para buscar os dados do usuário logado (protegida)
    path('me/', CurrentUserView.as_view(), name='current-user'),
]