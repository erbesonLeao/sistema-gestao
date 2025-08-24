# backend/maquinario/views.py - VERSÃO CORRETA

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Maquinario
from .serializers import MaquinarioSerializer

class MaquinarioViewSet(viewsets.ModelViewSet):
    queryset = Maquinario.objects.all()
    serializer_class = MaquinarioSerializer
    permission_classes = [IsAuthenticated]