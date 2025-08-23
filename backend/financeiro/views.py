# backend/financeiro/views.py - VERSÃO ATUALIZADA COM EXPORTAÇÃO CSV

import csv
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.views import APIView # Importamos a APIView base
from rest_framework.permissions import IsAuthenticated
from .models import CategoriaFinanceira, CentroDeCusto, LancamentoFinanceiro
from .serializers import CategoriaFinanceiraSerializer, CentroDeCustoSerializer, LancamentoFinanceiroSerializer

# --- ViewSets existentes (sem alteração) ---
class CategoriaFinanceiraViewSet(viewsets.ModelViewSet):
    queryset = CategoriaFinanceira.objects.all()
    serializer_class = CategoriaFinanceiraSerializer
    permission_classes = [IsAuthenticated]

class CentroDeCustoViewSet(viewsets.ModelViewSet):
    queryset = CentroDeCusto.objects.all()
    serializer_class = CentroDeCustoSerializer
    permission_classes = [IsAuthenticated]

class LancamentoFinanceiroViewSet(viewsets.ModelViewSet):
    queryset = LancamentoFinanceiro.objects.all().order_by('-data_lancamento')
    serializer_class = LancamentoFinanceiroSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

# --- AQUI ESTÁ A NOSSA NOVA VIEW DE EXPORTAÇÃO ---
class ExportLancamentosCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # 1. Prepara a resposta HTTP para ser um arquivo CSV
        response = HttpResponse(content_type='text/csv')
        # Define o nome do arquivo que será baixado
        response['Content-Disposition'] = 'attachment; filename="relatorio_financeiro.csv"'

        # 2. Cria o "escritor" de CSV
        writer = csv.writer(response)
        # Escreve a linha do cabeçalho
        writer.writerow([
            'ID', 'Descricao', 'Valor', 'Tipo', 'Status', 
            'Data Lancamento', 'Data Competencia', 'Categoria', 'Centro de Custo'
        ])

        # 3. Pega os filtros de data da URL (reaproveitando nossa lógica do dashboard)
        data_inicio_str = request.query_params.get('data_inicio', None)
        data_fim_str = request.query_params.get('data_fim', None)

        lancamentos = LancamentoFinanceiro.objects.select_related(
            'categoria', 'centro_de_custo'
        ).all().order_by('data_lancamento')

        if data_inicio_str and data_fim_str:
            lancamentos = lancamentos.filter(
                data_lancamento__range=[data_inicio_str, data_fim_str]
            )

        # 4. Escreve cada lançamento como uma linha no arquivo CSV
        for lancamento in lancamentos:
            writer.writerow([
                lancamento.id,
                lancamento.descricao,
                lancamento.valor,
                lancamento.tipo,
                lancamento.status_pagamento,
                lancamento.data_lancamento,
                lancamento.data_competencia,
                lancamento.categoria.nome if lancamento.categoria else '',
                lancamento.centro_de_custo.nome if lancamento.centro_de_custo else '',
            ])
        
        # 5. Retorna a resposta (o arquivo pronto para download)
        return response