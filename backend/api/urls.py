from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.me_view, name='me'),
    
    # Tutor endpoints
    path('tutors/', views.TutorListView.as_view(), name='tutor-list'),
    path('tutors/<uuid:id>/', views.TutorDetailView.as_view(), name='tutor-detail'),
    
    # Tutor interactions
    path('tutors/<uuid:tutor_id>/like/', views.like_tutor_view, name='like-tutor'),
    path('tutors/<uuid:tutor_id>/unlike/', views.unlike_tutor_view, name='unlike-tutor'),
    path('tutors/<uuid:tutor_id>/save/', views.save_tutor_view, name='save-tutor'),
    path('tutors/<uuid:tutor_id>/unsave/', views.unsave_tutor_view, name='unsave-tutor'),
    
    # User data
    path('users/saved-tutors/', views.saved_tutors_view, name='saved-tutors'),
    path('users/liked-tutors/', views.liked_tutors_view, name='liked-tutors'),
    path('users/profile/', views.update_profile_view, name='update-profile'),
    
    # Chat endpoints
    path('chats/', views.chat_rooms_view, name='chat-rooms'),
    path('chats/create/', views.create_chat_room_view, name='create-chat'),
    path('chats/<uuid:room_id>/messages/', views.chat_messages_view, name='chat-messages'),
    path('chats/<uuid:room_id>/send/', views.send_message_view, name='send-message'),
    
    # Review endpoints
    path('tutors/<uuid:tutor_id>/reviews/', views.tutor_reviews_view, name='tutor-reviews'),
    path('tutors/<uuid:tutor_id>/reviews/create/', views.create_review_view, name='create-review'),
    
    # File upload
    path('upload/profile-image/', views.upload_profile_image_view, name='upload-profile-image'),
    
    # Metadata
    path('subjects/', views.subjects_list_view, name='subjects-list'),
    path('platform/stats/', views.platform_stats_view, name='platform-stats'),
]