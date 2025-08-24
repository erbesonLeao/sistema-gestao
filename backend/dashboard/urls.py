# backend/dashboard/urls.py

from django.urls import path
from .views import DashboardSummaryView

urlpatterns = [
    # A URL completa será /api/dashboard/summary/
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]