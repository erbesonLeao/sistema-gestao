# backend/estoque/views.py - VERSÃO CORRIGIDA E SIMPLIFICADA

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Produto
from .serializers import ProdutoSerializer

# Corrigimos o nome para corresponder ao que as URLs esperam
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    # Não precisamos de mais nada aqui, o ModelViewSet faz todo o trabalho de CRUD.