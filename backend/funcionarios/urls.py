# backend/funcionarios/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FuncionarioViewSet, UsuariosNaoFuncionariosView

router = DefaultRouter()
router.register(r'funcionarios', FuncionarioViewSet, basename='funcionario')

urlpatterns = [
    # Rota para: /api/usuarios-disponiveis/
    path('usuarios-disponiveis/', UsuariosNaoFuncionariosView.as_view(), name='usuarios-disponiveis'),
    
    # Rota para: /api/funcionarios/
    path('', include(router.urls)),
]