# backend/usuarios/serializers.py - CÓDIGO COMPLETO

from django.contrib.auth.models import User
from rest_framework import serializers

class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Os campos que a nossa API vai usar
        fields = ('id', 'username', 'password') 
        # Garante que a senha não seja enviada de volta na resposta da API
        extra_kwargs = {'password': {'write_only': True}} 

    def create(self, validated_data):
        # Este método cria o usuário de forma segura, encriptando a senha
        user = User.objects.create_user(
            validated_data['username'], 
            password = validated_data['password']
        )
        return user