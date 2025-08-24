# backend/dashboard/views.py - VERSÃO ATUALIZADA COM FILTROS DE DATA

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
#from funcionarios.models import Funcionario para evita conflito
from maquinario.models import Maquinario
from estoque.models import Produto
from financeiro.models import LancamentoFinanceiro
from django.db.models import Sum, Count
from datetime import date, timedelta

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # --- 1. LÓGICA PARA CAPTURAR OS FILTROS DE DATA DA URL ---
        # Pegamos os parâmetros da URL, ex: ?data_inicio=2025-08-01&data_fim=2025-08-23
        data_inicio_str = request.query_params.get('data_inicio', None)
        data_fim_str = request.query_params.get('data_fim', None)

        # --- 2. PREPARAMOS A BASE DA CONSULTA FINANCEIRA ---
        # Começamos com todos os lançamentos
        base_lancamentos_query = LancamentoFinanceiro.objects.all()

        # Se as datas foram fornecidas, aplicamos o filtro de período
        if data_inicio_str and data_fim_str:
            # O filtro 'range' busca tudo que está ENTRE as duas datas
            base_lancamentos_query = base_lancamentos_query.filter(
                data_lancamento__range=[data_inicio_str, data_fim_str]
            )

        # --- 3. CÁLCULOS ATUALIZADOS USANDO A CONSULTA FILTRADA ---
        # Os cálculos financeiros agora partem da nossa consulta base (que pode ou não estar filtrada)
        receitas = base_lancamentos_query.filter(tipo='Receita', status_pagamento='Pago').aggregate(total=Sum('valor'))['total'] or 0
        despesas = base_lancamentos_query.filter(tipo='Despesa', status_pagamento='Pago').aggregate(total=Sum('valor'))['total'] or 0
        saldo = receitas - despesas

        # O gráfico de despesas também usará a consulta filtrada
        despesas_por_categoria = base_lancamentos_query.filter(tipo='Despesa').values('categoria__nome').annotate(total=Sum('valor')).order_by('-total')[:5]


        # --- CÁLCULOS NÃO SENSÍVEIS À DATA (permanecem como estavam) ---
        total_funcionarios_ativos = Funcionario.objects.filter(status='Ativo').count()
        total_maquinas = Maquinario.objects.count()
        total_produtos_estoque = Produto.objects.count()
        funcionarios_por_status = Funcionario.objects.values('status').annotate(total=Count('status')).order_by('status')

        # --- MURAL DE AVISOS (também não é afetado pelo filtro de data) ---
        mural_de_avisos = []
        hoje = date.today()
        aniversariantes_mes = Funcionario.objects.filter(data_nascimento__month=hoje.month)
        for func in aniversariantes_mes:
            mural_de_avisos.append(f"🎂 Aniversário de {func.nome_completo} no dia {func.data_nascimento.day}!")
        aniversario_empresa_mes = Funcionario.objects.filter(data_admissao__month=hoje.month)
        for func in aniversario_empresa_mes:
            anos_de_empresa = hoje.year - func.data_admissao.year
            if anos_de_empresa > 0:
                mural_de_avisos.append(f"🎉 {func.nome_completo} completa {anos_de_empresa} anos de empresa este mês!")
        mural_de_avisos.append("📅 Reunião geral da equipa na próxima sexta-feira às 10h.")
        mural_de_avisos.append("🍕 Pizza de confraternização no final do mês!")


        data = {
            'summary_cards': {
                'total_funcionarios_ativos': total_funcionarios_ativos,
                'total_maquinas': total_maquinas,
                'total_produtos_estoque': total_produtos_estoque,
                'saldo_financeiro': saldo,
            },
            'funcionarios_chart': list(funcionarios_por_status),
            'despesas_chart': list(despesas_por_categoria),
            'mural_de_avisos': mural_de_avisos,
        }

        return Response(data)