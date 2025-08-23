# backend/funcionarios/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FuncionarioViewSet # <-- Mude o nome da ViewSet aqui

router = DefaultRouter()
router.register(r'', FuncionarioViewSet, basename='funcionario') # <-- E aqui

urlpatterns = [
    path('', include(router.urls)),
]