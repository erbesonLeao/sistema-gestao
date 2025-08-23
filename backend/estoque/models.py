# backend/estoque/models.py - VERSÃO CORRIGIDA

from django.db import models
from maquinario.models import Maquinario

class Produto(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)
    quantidade_em_estoque = models.PositiveIntegerField(default=0)
    unidade_medida = models.CharField(max_length=20, default='unidade')
    ponto_de_ressuprimento = models.PositiveIntegerField(default=0)
    
    # Adicionamos um related_name para evitar conflitos
    maquina = models.ForeignKey(
        Maquinario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='produtos' 
    )

    def __str__(self):
        return self.nome