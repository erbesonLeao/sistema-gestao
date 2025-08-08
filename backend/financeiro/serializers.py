# backend/financeiro/serializers.py
from rest_framework import serializers
from .models import CategoriaFinanceira, CentroDeCusto, LancamentoFinanceiro

class CategoriaFinanceiraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaFinanceira
        fields = '__all__'

class CentroDeCustoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentroDeCusto
        fields = '__all__'

class LancamentoFinanceiroSerializer(serializers.ModelSerializer):
    # Para facilitar no frontend, mostramos o nome da categoria e do centro de custo, e não apenas o ID
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    centro_de_custo_nome = serializers.CharField(source='centro_de_custo.nome', read_only=True)

    class Meta:
        model = LancamentoFinanceiro
        fields = '__all__' # Inclui todos os campos do nosso modelo