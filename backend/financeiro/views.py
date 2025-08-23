# backend/financeiro/views.py - VERSÃO DE DEBUG PARA CAPTURAR ERROS

import csv
import traceback # Importamos a biblioteca de traceback
from io import StringIO # Usaremos para criar o CSV em memória
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response # Importamos a Response do DRF
from rest_framework import status # Importamos os status HTTP
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

# --- NOVA VERSÃO DA VIEW DE EXPORTAÇÃO COM CAPTURA DE ERRO ---
class ExportLancamentosCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # Tenta executar a lógica de exportação
            data_inicio_str = request.query_params.get('data_inicio', None)
            data_fim_str = request.query_params.get('data_fim', None)

            lancamentos = LancamentoFinanceiro.objects.select_related(
                'categoria', 'centro_de_custo'
            ).filter(criado_por=request.user).order_by('data_lancamento')

            if data_inicio_str and data_fim_str:
                lancamentos = lancamentos.filter(
                    data_lancamento__range=[data_inicio_str, data_fim_str]
                )
            
            # Usamos StringIO para criar o CSV em memória
            buffer = StringIO()
            buffer.write(u'\ufeff') # BOM para compatibilidade com Excel
            writer = csv.writer(buffer)
            
            writer.writerow([
                'ID', 'Descricao', 'Valor', 'Tipo', 'Status', 
                'Data Lancamento', 'Data Competencia', 'Categoria', 'Centro de Custo'
            ])

            for lancamento in lancamentos:
                categoria_nome = getattr(lancamento.categoria, 'nome', '')
                centro_custo_nome = getattr(lancamento.centro_de_custo, 'nome', '')
                writer.writerow([
                    lancamento.id, lancamento.descricao, lancamento.valor,
                    lancamento.tipo, lancamento.status_pagamento, lancamento.data_lancamento,
                    lancamento.data_competencia, categoria_nome, centro_custo_nome,
                ])

            # Prepara a resposta HTTP com o arquivo
            response = HttpResponse(buffer.getvalue(), content_type='text/csv; charset=utf-8')
            response['Content-Disposition'] = 'attachment; filename="relatorio_financeiro.csv"'
            return response

        except Exception as e:
            # SE UM ERRO ACONTECER, CAPTURA O TRACEBACK COMPLETO
            error_traceback = traceback.format_exc()
            print(error_traceback) # Imprime o erro no log da Render também
            # E ENVIA O ERRO DETALHADO COMO RESPOSTA
            return Response(
                {"error": str(e), "traceback": error_traceback},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )