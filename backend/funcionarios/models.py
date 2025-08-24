# backend/funcionarios/models.py - VERSÃO FINAL

from django.db import models
from django.conf import settings # Usar settings.AUTH_USER_MODEL é a melhor prática

class Funcionario(models.Model):
    STATUS_CHOICES = (
        ("Ativo", "Ativo"),
        ("Demitido", "Demitido"),
        ("Férias", "Férias"),
    )

    # Ligação um-para-um com o modelo de usuário do Django
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nome_completo = models.CharField(max_length=200)
    cargo = models.CharField(max_length=100)
    data_admissao = models.DateField()
    data_nascimento = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Ativo")

    def __str__(self):
        return self.nome_completo