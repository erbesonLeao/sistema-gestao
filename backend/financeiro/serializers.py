# backend/financeiro/serializers.py - VERSÃO CORRIGIDA

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
    # Para facilitar no frontend, mostramos os nomes e não apenas os IDs
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    centro_de_custo_nome = serializers.CharField(source='centro_de_custo.nome', read_only=True)

    class Meta:
        model = LancamentoFinanceiro
        fields = '__all__'
        # AQUI ESTÁ A MUDANÇA: Dizemos que o campo 'criado_por' não será enviado pelo frontend.
        # O backend irá preenchê-lo automaticamente.
        read_only_fields = ['criado_por']