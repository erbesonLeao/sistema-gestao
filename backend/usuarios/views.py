# backend/usuarios/views.py - VERSÃO CORRIGIDA

from django.contrib.auth.models import User
from .serializers import RegistroSerializer, UserSerializer # Importamos o novo UserSerializer
from rest_framework import generics # << AQUI ESTÁ A CORREÇÃO: Importamos o 'generics'
from rest_framework.permissions import AllowAny, IsAuthenticated # Importamos IsAuthenticated

# View para CRIAR um novo usuário (qualquer um pode se registrar)
class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Permite acesso sem autenticação
    serializer_class = RegistroSerializer

# View para retornar os dados do usuário atualmente logado
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated] # Apenas usuários autenticados podem acessar
    serializer_class = UserSerializer

    def get_object(self):
        # A mágica acontece aqui: retornamos o 'request.user', que o Django já
        # sabe quem é, graças ao token de autenticação.
        return self.request.user