from rest_framework import serializers
from .models import Maquinario

class MaquinarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquinario
        fields = ['id', 'nome', 'identificador', 'descricao']