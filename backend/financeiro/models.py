# backend/financeiro/models.py

from django.db import models
from django.conf import settings

class CategoriaFinanceira(models.Model):
    TIPO_CHOICES = (
        ('Receita', 'Receita'),
        ('Despesa', 'Despesa'),
    )
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)

    def __str__(self):
        return f"{self.nome} ({self.tipo})"

class CentroDeCusto(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome

class LancamentoFinanceiro(models.Model):
    TIPO_CHOICES = (
        ('Receita', 'Receita'),
        ('Despesa', 'Despesa'),
    )
    STATUS_CHOICES = (
        ('Pendente', 'Pendente'),
        ('Pago', 'Pago'),
        ('Atrasado', 'Atrasado'),
        ('Cancelado', 'Cancelado'),
    )

    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)
    status_pagamento = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pendente')
    data_lancamento = models.DateField()
    data_competencia = models.DateField(help_text="Mês a que o lançamento se refere")

    # Ligações com as outras tabelas
    categoria = models.ForeignKey(CategoriaFinanceira, on_delete=models.SET_NULL, null=True, blank=True)
    centro_de_custo = models.ForeignKey(CentroDeCusto, on_delete=models.SET_NULL, null=True, blank=True)

    # Outros campos úteis
    nota_fiscal = models.CharField(max_length=100, blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)

    # Rastreabilidade
    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='lancamentos_criados')
    data_de_criacao = models.DateTimeField(auto_now_add=True)
    ultima_atualizacao = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.descricao} - R$ {self.valor}"