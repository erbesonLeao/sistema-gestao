# backend/funcionarios/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Funcionario
from django.db import transaction

# Um serializer simples SÓ para os dados do usuário que virão no formulário
class UserDataSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class FuncionarioSerializer(serializers.ModelSerializer):
    # AQUI: Adicionamos required=False para que não seja obrigatório ao editar
    user = UserDataSerializer(write_only=True, required=False)
    username_read = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Funcionario
        fields = ['id', 'user', 'nome_completo', 'cargo', 'data_admissao', 'status', 'username_read']
    
    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['username'],
            password=user_data['password']
        )
        funcionario = Funcionario.objects.create(user=user, **validated_data)
        return funcionario