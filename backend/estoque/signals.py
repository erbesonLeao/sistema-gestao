# backend/estoque/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Produto
from core.models import Notificacao # Importamos nosso modelo de notificação

# @receiver é o "decorador" que conecta nossa função ao sinal
# post_save é o sinal que é disparado DEPOIS que um objeto é salvo
# sender=Produto diz ao Django para só acionar este sinal para o modelo Produto
@receiver(post_save, sender=Produto)
def verificar_ponto_ressuprimento(sender, instance, created, **kwargs):
    """
    Este sinal verifica o estoque de um produto sempre que ele é salvo.
    Se a quantidade estiver abaixo do ponto de ressuprimento, cria uma notificação
    para todos os usuários que são 'staff' (gerentes).
    """
    
    # 'instance' é o objeto Produto que acabou de ser salvo
    produto = instance
    
    # Verificamos se a quantidade em estoque é menor ou igual ao ponto de ressuprimento
    # E também se o ponto de ressuprimento não é zero (para evitar notificações desnecessárias)
    if produto.quantidade_em_estoque <= produto.ponto_de_ressuprimento and produto.ponto_de_ressuprimento > 0:
        
        # Prepara a mensagem da notificação
        mensagem = f"Atenção: O estoque do produto '{produto.nome}' está baixo ({produto.quantidade_em_estoque} unidades)."
        link_para_estoque = '/estoque' # Link para o frontend

        # Pega todos os usuários que são administradores/gerentes
        # (Você pode ajustar esta lógica para notificar usuários específicos se quiser)
        usuarios_gerentes = User.objects.filter(is_staff=True)

        for usuario in usuarios_gerentes:
            # Cria a notificação para cada gerente
            # O 'defaults' garante que não criaremos notificações duplicadas idênticas
            Notificacao.objects.get_or_create(
                usuario=usuario,
                mensagem=mensagem,
                link=link_para_estoque,
                defaults={'lida': False} # Só define 'lida' como False se estiver criando
            )
            print(f"Notificação de estoque baixo criada para {usuario.username}")