# backend/core/handlers.py

from django.dispatch import receiver
from django.contrib.auth.models import User
from estoque.signals import estoque_baixo_signal # 1. Importamos o "aviso" que a app estoque emite
from .models import Notificacao # 2. Importamos nosso modelo de notificação

# 3. Conectamos nossa função ao sinal. Agora, toda vez que o 'estoque_baixo_signal'
#    for emitido, esta função será executada.
@receiver(estoque_baixo_signal)
def criar_notificacao_estoque_baixo(sender, produto, **kwargs):
    """
    Este "ouvinte" recebe o sinal de estoque baixo e cria a notificação
    para todos os usuários administradores.
    """
    
    # Prepara a mensagem e o link
    mensagem = f"Atenção: O estoque de '{produto.nome}' está baixo ({produto.quantidade_em_estoque} unidades)."
    link = '/estoque'

    # Busca os usuários que devem ser notificados (ex: todos os admins)
    usuarios_gerentes = User.objects.filter(is_staff=True)

    for usuario in usuarios_gerentes:
        # Cria a notificação para cada gerente
        Notificacao.objects.create(
            usuario=usuario,
            mensagem=mensagem,
            link=link,
        )
        print(f"Notificação de estoque baixo CRIADA para o usuário: {usuario.username}")