# backend/dashboard/serializers.py - VERSÃO FINAL CORRIGIDA

from rest_framework import serializers

class SummaryCardsSerializer(serializers.Serializer):
    total_funcionarios_ativos = serializers.IntegerField()
    total_maquinas = serializers.IntegerField()
    total_produtos_estoque = serializers.IntegerField()
    saldo_financeiro = serializers.DecimalField(max_digits=10, decimal_places=2)

# AQUI ESTÁ A CORREÇÃO: Criamos um serializer específico para este gráfico
class FuncionariosChartSerializer(serializers.Serializer):
    status = serializers.CharField() # Ele espera um campo 'status'
    total = serializers.IntegerField()  # E um campo 'total'

class DespesasChartSerializer(serializers.Serializer):
    categoria__nome = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)

class DashboardSerializer(serializers.Serializer):
    summary_cards = SummaryCardsSerializer()
    # E o usamos aqui
    funcionarios_chart = FuncionariosChartSerializer(many=True) 
    despesas_chart = DespesasChartSerializer(many=True)
    mural_de_avisos = serializers.ListField(child=serializers.CharField())