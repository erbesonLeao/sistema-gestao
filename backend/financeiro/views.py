# backend/financeiro/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CategoriaFinanceira, CentroDeCusto, LancamentoFinanceiro
from .serializers import CategoriaFinanceiraSerializer, CentroDeCustoSerializer, LancamentoFinanceiroSerializer

class CategoriaFinanceiraViewSet(viewsets.ModelViewSet):
    queryset = CategoriaFinanceira.objects.all()
    serializer_class = CategoriaFinanceiraSerializer
    permission_classes = [IsAuthenticated]

class CentroDeCustoViewSet(viewsets.ModelViewSet):
    queryset = CentroDeCusto.objects.all()
    serializer_class = CentroDeCustoSerializer
    permission_classes = [IsAuthenticated]

class LancamentoFinanceiroViewSet(viewsets.ModelViewSet):
    queryset = LancamentoFinanceiro.objects.all().order_by('-data_lancamento') # Ordena do mais recente para o mais antigo
    serializer_class = LancamentoFinanceiroSerializer
    permission_classes = [IsAuthenticated]