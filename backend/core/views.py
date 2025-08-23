# backend/core/views.py

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notificacao
from .serializers import NotificacaoSerializer

class NotificacaoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e marcar notificações como lidas.
    A listagem é apenas de leitura (ReadOnly).
    """
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Esta mágica garante que o usuário só veja as suas próprias notificações.
        """
        return Notificacao.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=['post'])
    def marcar_todas_como_lidas(self, request):
        """
        Uma "ação" customizada na nossa API. Ao fazer um POST para /api/core/notificacoes/marcar_todas_como_lidas/,
        todas as notificações do usuário serão marcadas como lidas.
        """
        self.get_queryset().update(lida=True)
        return Response(status=status.HTTP_204_NO_CONTENT)