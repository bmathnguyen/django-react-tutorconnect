# profiles/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # User profile endpoints
    path('users/profile/', views.update_profile_view, name='update-profile'),
    path('upload/profile-image/', views.upload_profile_image_view, name='upload-profile-image'),
]

