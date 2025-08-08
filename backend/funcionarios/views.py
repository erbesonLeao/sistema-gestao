# backend/funcionarios/views.py - CÓDIGO COMPLETO E CORRIGIDO

from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Funcionario
from .serializers import FuncionarioSerializer

# Importamos o UserSerializer do nosso app de usuarios
from usuarios.serializers import RegistroSerializer as UserSerializer


# ViewSet para gerenciar Funcionários (CRUD completo)
class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    permission_classes = [IsAuthenticated]


# View para listar usuários que ainda não são funcionários
class UsuariosNaoFuncionariosView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Pega os IDs de todos os usuários que JÁ SÃO funcionários
        usuarios_funcionarios_ids = Funcionario.objects.values_list('user_id', flat=True)
        # Retorna todos os usuários CUJO ID NÃO ESTÁ na lista acima
        return User.objects.exclude(id__in=usuarios_funcionarios_ids)