# backend/usuarios/views.py - VERSÃO FINAL E CORRETA

from django.contrib.auth.models import User
from .serializers import RegistroSerializer, UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

# View para CRIAR um novo usuário (qualquer um pode se registrar)
class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistroSerializer

# View para retornar os dados do usuário atualmente logado
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user