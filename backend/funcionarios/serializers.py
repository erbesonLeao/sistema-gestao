# backend/funcionarios/serializers.py - VERSÃO FINAL

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Funcionario

# Serializer para criar o User junto com o Funcionario
class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class FuncionarioSerializer(serializers.ModelSerializer):
    user = UserNestedSerializer(required=True)
    username_read = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Funcionario
        fields = ['id', 'user', 'nome_completo', 'cargo', 'data_admissao', 'status', 'data_nascimento', 'username_read']
        read_only_fields = ['id', 'username_read']


    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # Usamos create_user para garantir que a senha seja criptografada (hashed)
        user = User.objects.create_user(**user_data)
        funcionario = Funcionario.objects.create(user=user, **validated_data)
        return funcionario

    def update(self, instance, validated_data):
        # Remove o campo 'user' dos dados de validação, pois não permitimos
        # alterar o usuário associado a um funcionário na edição.
        validated_data.pop('user', None)
        return super().update(instance, validated_data)