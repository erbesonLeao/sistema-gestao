# backend/usuarios/serializers.py - VERSÃO FINAL E COMPLETA

from django.contrib.auth.models import User
from rest_framework import serializers

# Este Serializer é para mostrar os dados de um usuário já existente.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


# Este Serializer é para CRIAR um novo usuário.
# Ele é usado pela nossa RegistroView.
class RegistroSerializer(serializers.ModelSerializer):
    # Garantimos que a senha seja exigida e não seja retornada na resposta
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        # Definimos os campos necessários para o registro
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        # Usamos o método create_user para garantir que a senha seja salva
        # com a criptografia (hash) correta.
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user