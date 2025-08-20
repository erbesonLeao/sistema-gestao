# backend/usuarios/serializers.py - VERSÃO ATUALIZADA

from django.contrib.auth.models import User
from rest_framework import serializers

# Este Serializer é para mostrar os dados de um usuário já existente.
# Ele não inclui o campo de senha por segurança.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


# Este é o seu Serializer original para criar um novo usuário.
# Ele exige uma senha para o registro.
class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user