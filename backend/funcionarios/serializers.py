# backend/funcionarios/serializers.py - VERSÃO FINAL E CORRETA

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Funcionario

# Este serializer é para lidar com os dados do usuário aninhado ao criar um funcionário
class UserDataSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class FuncionarioSerializer(serializers.ModelSerializer):
    # Usamos o UserDataSerializer para a escrita (criação)
    user = UserDataSerializer(write_only=True, required=False)
    # E um campo simples para a leitura do username
    username_read = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Funcionario
        fields = ['id', 'user', 'nome_completo', 'cargo', 'data_admissao', 'status', 'username_read']

    def create(self, validated_data):
        # Lógica para criar o User e o Funcionario juntos
        user_data = validated_data.pop('user')
        # Usamos o método create_user para garantir que a senha seja salva corretamente (hash)
        user = User.objects.create_user(
            username=user_data['username'],
            password=user_data['password']
        )
        # Criamos o funcionário associado ao usuário recém-criado
        funcionario = Funcionario.objects.create(user=user, **validated_data)
        return funcionario