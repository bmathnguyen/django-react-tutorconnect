# interactions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Tutor interactions
    path('tutors/<uuid:tutor_id>/like/', views.like_tutor_view, name='like-tutor'),
    path('tutors/<uuid:tutor_id>/unlike/', views.unlike_tutor_view, name='unlike-tutor'),
    path('tutors/<uuid:tutor_id>/save/', views.save_tutor_view, name='save-tutor'),
    path('tutors/<uuid:tutor_id>/unsave/', views.unsave_tutor_view, name='unsave-tutor'),
    
    # User data
    path('users/saved-tutors/', views.saved_tutors_view, name='saved-tutors'),
    path('users/liked-tutors/', views.liked_tutors_view, name='liked-tutors'),
]

