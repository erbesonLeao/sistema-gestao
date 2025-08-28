# backend/estoque/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver, Signal

# 1. Criamos nosso "aviso" (sinal) customizado.
estoque_baixo_signal = Signal()

# 2. Conectamos uma função ao evento de salvar um Produto.
#    Usamos o caminho em string 'estoque.Produto' para máxima segurança contra erros de importação.
@receiver(post_save, sender='estoque.Produto')
def verificar_ponto_ressuprimento(sender, instance, **kwargs):
    """
    Verifica o estoque de um produto sempre que ele é salvo.
    Se a quantidade estiver baixa, EMITE o nosso sinal customizado.
    """
    produto = instance
    
    if produto.quantidade_em_estoque <= produto.ponto_de_ressuprimento and produto.ponto_de_ressuprimento > 0:
        # 3. Emitimos o sinal, enviando o objeto 'produto' como informação.
        #    Qualquer parte do sistema poderá "ouvir" este sinal agora.
        estoque_baixo_signal.send(sender=sender, produto=produto)
        print(f"Sinal de estoque baixo emitido para o produto: {produto.nome}")