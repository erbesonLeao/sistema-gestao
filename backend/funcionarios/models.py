# backend/funcionarios/models.py
from django.db import models
from django.contrib.auth.models import User

class Funcionario(models.Model):
    STATUS_CHOICES = (
        ("Ativo", "Ativo"),
        ("Demitido", "Demitido"),
        ("Férias", "Férias"),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nome_completo = models.CharField(max_length=200)
    cargo = models.CharField(max_length=100)
    data_admissao = models.DateField()
    data_nascimento = models.DateField(null=True, blank=True) # <-- CAMPO ADICIONADO
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Ativo")

    def __str__(self):
        return self.nome_completo