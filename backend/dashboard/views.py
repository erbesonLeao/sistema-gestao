# backend/dashboard/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from funcionarios.models import Funcionario
from maquinario.models import Maquinario
from estoque.models import Produto
from financeiro.models import LancamentoFinanceiro
from django.db.models import Sum, Count
from datetime import date, timedelta

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # --- Cálculos para os Cartões de Resumo (já existentes) ---
        total_funcionarios_ativos = Funcionario.objects.filter(status='Ativo').count()
        total_maquinas = Maquinario.objects.count()
        total_produtos_estoque = Produto.objects.count()
        receitas = LancamentoFinanceiro.objects.filter(tipo='Receita', status_pagamento='Pago').aggregate(total=Sum('valor'))['total'] or 0
        despesas = LancamentoFinanceiro.objects.filter(tipo='Despesa', status_pagamento='Pago').aggregate(total=Sum('valor'))['total'] or 0
        saldo = receitas - despesas

        # --- DADOS PARA OS GRÁFICOS (já existentes) ---
        funcionarios_por_status = Funcionario.objects.values('status').annotate(total=Count('status')).order_by('status')
        despesas_por_categoria = LancamentoFinanceiro.objects.filter(tipo='Despesa').values('categoria__nome').annotate(total=Sum('valor')).order_by('-total')[:5]

        # --- NOVA LÓGICA: MURAL DE AVISOS ---
        mural_de_avisos = []
        hoje = date.today()

        # 1. Aniversariantes do Mês
        aniversariantes_mes = Funcionario.objects.filter(data_nascimento__month=hoje.month)
        for func in aniversariantes_mes:
            mural_de_avisos.append(f"🎂 Aniversário de {func.nome_completo} no dia {func.data_nascimento.day}!")

        # 2. Aniversário de Empresa no Mês
        aniversario_empresa_mes = Funcionario.objects.filter(data_admissao__month=hoje.month)
        for func in aniversario_empresa_mes:
            anos_de_empresa = hoje.year - func.data_admissao.year
            if anos_de_empresa > 0:
                mural_de_avisos.append(f"🎉 {func.nome_completo} completa {anos_de_empresa} anos de empresa este mês!")

        # 3. Eventos (exemplo fixo, poderia vir de outra tabela no futuro)
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
            'mural_de_avisos': mural_de_avisos, # <-- Nova informação
        }

        return Response(data)