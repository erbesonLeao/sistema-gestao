# backend/estoque/serializers.py
from rest_framework import serializers
from .models import Produto

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__' # Inclui todos os campos do nosso modelo