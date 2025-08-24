# backend/core/serializers.py - ADICIONANDO O SERIALIZER DO DASHBOARD

from rest_framework import serializers
from .models import Notificacao

# Serializer de Notificação (já existente)
class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = ['id', 'mensagem', 'lida', 'link', 'data_criacao']

# AQUI ESTÃO OS SERIALIZERS DO DASHBOARD, AGORA NA APP 'core'
class SummaryCardsSerializer(serializers.Serializer):
    total_funcionarios_ativos = serializers.IntegerField()
    total_maquinas = serializers.IntegerField()
    total_produtos_estoque = serializers.IntegerField()
    saldo_financeiro = serializers.DecimalField(max_digits=10, decimal_places=2)

class FuncionariosChartSerializer(serializers.Serializer):
    status = serializers.CharField()
    total = serializers.IntegerField()

class DespesasChartSerializer(serializers.Serializer):
    categoria__nome = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)

class DashboardSerializer(serializers.Serializer):
    summary_cards = SummaryCardsSerializer()
    funcionarios_chart = FuncionariosChartSerializer(many=True) 
    despesas_chart = DespesasChartSerializer(many=True)
    mural_de_avisos = serializers.ListField(child=serializers.CharField())