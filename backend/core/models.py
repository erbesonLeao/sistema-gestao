# backend/core/models.py

from django.db import models
from django.conf import settings

class Notificacao(models.Model):
    # O usuário que receberá a notificação. Se o usuário for deletado, a notificação também será.
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # A mensagem que será exibida.
    mensagem = models.CharField(max_length=255)
    
    # Um campo para sabermos se o usuário já leu a notificação.
    lida = models.BooleanField(default=False)
    
    # Um link opcional para redirecionar o usuário ao clicar na notificação (ex: '/estoque/')
    link = models.CharField(max_length=255, blank=True, null=True)

    # Campos de data para sabermos quando a notificação foi criada.
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notificação para {self.usuario.username}: {self.mensagem[:30]}..."

    class Meta:
        # Garante que as notificações mais recentes apareçam primeiro.
        ordering = ['-data_criacao']