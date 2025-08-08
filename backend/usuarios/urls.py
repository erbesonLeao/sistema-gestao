# backend/usuarios/urls.py
from django.urls import path
# Vamos descomentar a view para o futuro
from .views import RegistroView 

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
]