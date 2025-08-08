# backend/estoque/models.py

from django.db import models

class Produto(models.Model):
    nome = models.CharField(max_length=200, unique=True)
    descricao = models.TextField(blank=True, null=True) # Descrição é opcional
    quantidade_em_estoque = models.IntegerField(default=0)
    unidade_medida = models.CharField(max_length=50, default='unidade') # Ex: unidade, kg, litro, metro
    ponto_de_ressuprimento = models.IntegerField(default=0, help_text="Quantidade mínima para alertar a necessidade de compra.")
    data_de_criacao = models.DateTimeField(auto_now_add=True)
    ultima_atualizacao = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome