# backend/financeiro/views.py - VERSÃO CORRIGIDA

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
    queryset = LancamentoFinanceiro.objects.all().order_by('-data_lancamento')
    serializer_class = LancamentoFinanceiroSerializer
    permission_classes = [IsAuthenticated]

    # AQUI ESTÁ A MUDANÇA: Adicionamos este método
    def perform_create(self, serializer):
        # Este método é chamado automaticamente ao criar um novo objeto.
        # Ele pega o usuário logado (self.request.user) e o salva no campo 'criado_por'.
        serializer.save(criado_por=self.request.user)