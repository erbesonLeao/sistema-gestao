# backend/usuarios/views.py - CÓDIGO COMPLETO

from django.contrib.auth.models import User
from .serializers import RegistroSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny

# View para CRIAR um novo usuário (qualquer um pode se registrar)
class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Permite acesso sem autenticação
    serializer_class = RegistroSerializer