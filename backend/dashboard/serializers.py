# backend/dashboard/serializers.py

from rest_framework import serializers

class SummaryCardsSerializer(serializers.Serializer):
    total_funcionarios_ativos = serializers.IntegerField()
    total_maquinas = serializers.IntegerField()
    total_produtos_estoque = serializers.IntegerField()
    saldo_financeiro = serializers.DecimalField(max_digits=10, decimal_places=2)

class ChartDataSerializer(serializers.Serializer):
    # Este serializer pode ser usado para vários tipos de gráficos
    label = serializers.CharField(source='status') # Ajuste a fonte se necessário
    total = serializers.IntegerField()

class DespesasChartSerializer(serializers.Serializer):
    categoria__nome = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)

class DashboardSerializer(serializers.Serializer):
    summary_cards = SummaryCardsSerializer()
    funcionarios_chart = ChartDataSerializer(many=True)
    despesas_chart = DespesasChartSerializer(many=True)
    mural_de_avisos = serializers.ListField(child=serializers.CharField())