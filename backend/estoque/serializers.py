# backend/estoque/serializers.py - VERSÃO CORRIGIDA

from rest_framework import serializers
from .models import Produto

class ProdutoSerializer(serializers.ModelSerializer):
    # Mostra o nome da máquina em vez do ID, se houver uma máquina associada
    maquina_nome = serializers.CharField(source='maquina.nome', read_only=True)

    class Meta:
        model = Produto
        # Incluímos o novo campo 'maquina_nome' para leitura
        fields = [
            'id', 'nome', 'descricao', 'quantidade_em_estoque', 
            'unidade_medida', 'ponto_de_ressuprimento', 'maquina', 'maquina_nome'
        ]
        # O campo 'maquina' será um ID para escrita
        extra_kwargs = {
            'maquina': {'write_only': True, 'required': False}
        }