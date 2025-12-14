# subjects/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Metadata endpoints
    path('subjects/', views.subjects_list_view, name='subjects-list'),
    path('platform/stats/', views.platform_stats_view, name='platform-stats'),
]

