# backend/dashboard/views.py - VERSÃO FINAL E CORRETA

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from funcionarios.models import Funcionario
from maquinario.models import Maquinario
from estoque.models import Produto
from financeiro.models import LancamentoFinanceiro
from django.db.models import Sum, Count
from datetime import date
from .serializers import DashboardSerializer # Importa nosso novo serializer

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Lógica de filtro de data (mantida)
        data_inicio_str = request.query_params.get('data_inicio', None)
        data_fim_str = request.query_params.get('data_fim', None)

        base_lancamentos_query = LancamentoFinanceiro.objects.all()
        if data_inicio_str and data_fim_str:
            base_lancamentos_query = base_lancamentos_query.filter(
                data_lancamento__range=[data_inicio_str, data_fim_str]
            )

        # Monta o objeto de dados exatamente como o serializer espera
        summary_cards_data = {
            'total_funcionarios_ativos': Funcionario.objects.filter(status='Ativo').count(),
            'total_maquinas': Maquinario.objects.count(),
            'total_produtos_estoque': Produto.objects.count(),
            'saldo_financeiro': (base_lancamentos_query.filter(tipo='Receita', status_pagamento='Pago').aggregate(total=Sum('valor'))['total'] or 0) - \
                                (base_lancamentos_query.filter(tipo='Despesa', status_pagamento='Pago').aggregate(total=Sum('valor'))['total'] or 0)
        }
        funcionarios_chart_data = Funcionario.objects.values('status').annotate(total=Count('status')).order_by('status')
        despesas_chart_data = base_lancamentos_query.filter(tipo='Despesa').values('categoria__nome').annotate(total=Sum('valor')).order_by('-total')[:5]

        # Lógica do mural de avisos (mantida)
        mural_de_avisos = []
        hoje = date.today()
        aniversariantes_mes = Funcionario.objects.filter(data_nascimento__month=hoje.month)
        for func in aniversariantes_mes:
            mural_de_avisos.append(f"🎂 Aniversário de {func.nome_completo} no dia {func.data_nascimento.day}!")
        # ... (o resto da sua lógica do mural continua aqui) ...
        aniversario_empresa_mes = Funcionario.objects.filter(data_admissao__month=hoje.month)
        for func in aniversario_empresa_mes:
            anos_de_empresa = hoje.year - func.data_admissao.year
            if anos_de_empresa > 0:
                mural_de_avisos.append(f"🎉 {func.nome_completo} completa {anos_de_empresa} anos de empresa este mês!")
        mural_de_avisos.append("📅 Reunião geral da equipa na próxima sexta-feira às 10h.")
        mural_de_avisos.append("🍕 Pizza de confraternização no final do mês!")


        # Cria o dicionário final
        data = {
            'summary_cards': summary_cards_data,
            'funcionarios_chart': list(funcionarios_chart_data),
            'despesas_chart': list(despesas_chart_data),
            'mural_de_avisos': mural_de_avisos,
        }

        # Usa o serializer para validar e formatar a saída
        serializer = DashboardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)