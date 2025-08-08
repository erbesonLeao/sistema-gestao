# backend/maquinario/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaquinarioViewSet

router = DefaultRouter()
router.register(r'maquinario', MaquinarioViewSet, basename='maquinario')

urlpatterns = [
    path('', include(router.urls)),
]