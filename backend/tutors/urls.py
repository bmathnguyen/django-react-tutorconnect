# tutors/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Tutor endpoints
    path('tutors/', views.TutorSearchView.as_view(), name='tutor-search'),
    path('tutors/<uuid:uuid>/', views.TutorDetailView.as_view(), name='tutor-detail'),
]

