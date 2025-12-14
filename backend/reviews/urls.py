# reviews/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Review endpoints
    path('tutors/<uuid:tutor_id>/reviews/', views.tutor_reviews_view, name='tutor-reviews'),
    path('tutors/<uuid:tutor_id>/reviews/create/', views.create_review_view, name='create-review'),
]

