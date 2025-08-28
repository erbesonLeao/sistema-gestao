# backend/estoque/models.py - VERSÃO FINAL COM SINAL DIRETO

from django.db import models
from maquinario.models import Maquinario

# --- SEU MODELO PRODUTO (sem alterações) ---
class Produto(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)
    quantidade_em_estoque = models.PositiveIntegerField(default=0)
    unidade_medida = models.CharField(max_length=20, default='unidade')
    ponto_de_ressuprimento = models.PositiveIntegerField(default=0)
    maquina = models.ForeignKey(
        Maquinario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='produtos' 
    )

    def __str__(self):
        return self.nome

# --- LÓGICA DO SINAL AGORA VIVE AQUI ---
from django.db.models.signals import post_save
from django.dispatch import receiver, Signal

# Criamos o sinal customizado
estoque_baixo_signal = Signal()

@receiver(post_save, sender=Produto) # O sender aqui é a classe Produto, definida logo acima
def verificar_ponto_ressuprimento(sender, instance, **kwargs):
    """
    Verifica o estoque de um produto sempre que ele é salvo e emite o sinal.
    """
    produto = instance
    if produto.quantidade_em_estoque <= produto.ponto_de_ressuprimento and produto.ponto_de_ressuprimento > 0:
        estoque_baixo_signal.send(sender=sender, produto=produto)
        print(f"Sinal de estoque baixo emitido DIRETAMENTE DO MODELS.PY para o produto: {produto.nome}")