from django.db import models

class Maquinario(models.Model):
    nome = models.CharField(max_length=100)
    identificador = models.CharField(max_length=50, unique=True)
    descricao = models.TextField()

    def __str__(self):
        return self.nome