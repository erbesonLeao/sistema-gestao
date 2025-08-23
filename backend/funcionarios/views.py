# backend/funcionarios/views.py - VERSÃO CORRIGIDA E SIMPLIFICADA

from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Funcionario
# Removemos a importação de UserSerializer daqui para simplificar
from .serializers import FuncionarioSerializer
# E importamos um serializer de usuário genérico que faremos a seguir
from usuarios.serializers import UserSerializer # Mantemos esta importação por enquanto para a outra view

class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    permission_classes = [IsAuthenticated]

# View para listar usuários que ainda não são funcionários
class UsuariosNaoFuncionariosView(generics.ListAPIView):
    serializer_class = UserSerializer # Este serializer vem de 'usuarios'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Pega os IDs de todos os usuários que JÁ SÃO funcionários
        funcionarios_user_ids = Funcionario.objects.values_list('user_id', flat=True)
        # Retorna todos os usuários CUJO ID NÃO ESTÁ na lista acima
        return User.objects.exclude(id__in=funcionarios_user_ids)