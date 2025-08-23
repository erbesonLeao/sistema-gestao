# backend/maquinario/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaquinarioViewSet # <-- Mude o nome da ViewSet aqui

router = DefaultRouter()
router.register(r'', MaquinarioViewSet, basename='maquinario') # <-- E aqui

urlpatterns = [
    path('', include(router.urls)),
]