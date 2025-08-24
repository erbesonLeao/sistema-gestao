# backend/funcionarios/views.py - VERSÃO FINAL

from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Funcionario
from .serializers import FuncionarioSerializer
from usuarios.serializers import UserSerializer # Para a lista de usuários

class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all().order_by('nome_completo')
    serializer_class = FuncionarioSerializer
    permission_classes = [IsAuthenticated]

class UsuariosNaoFuncionariosView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        funcionarios_user_ids = Funcionario.objects.values_list('user_id', flat=True)
        return User.objects.exclude(id__in=funcionarios_user_ids)