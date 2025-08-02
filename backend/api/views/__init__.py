# Views package for TutorConnect API

# views/__init__.py
from .auth import register_view, login_view, logout_view, me_view
from .tutor import TutorDetailView
from .search import TutorSearchView

from .interaction import (
    like_tutor_view, unlike_tutor_view, 
    save_tutor_view, unsave_tutor_view,
    saved_tutors_view, liked_tutors_view
)
from .profile import update_profile_view, upload_profile_image_view
from .chat import (
    chat_rooms_view, create_chat_room_view, 
    chat_messages_view, send_message_view
)
from .review import tutor_reviews_view, create_review_view
from .metadata import subjects_list_view, platform_stats_view

__all__ = [
    # Auth views
    'register_view',
    'login_view', 
    'logout_view',
    'me_view',
    
    # Tutor views
    'TutorDetailView',
    'TutorSearchView',

    
    # Interaction views
    'like_tutor_view',
    'unlike_tutor_view',
    'save_tutor_view', 
    'unsave_tutor_view',
    'saved_tutors_view',
    'liked_tutors_view',
    
    # Profile views
    'update_profile_view',
    'upload_profile_image_view',
    
    # Chat views
    'chat_rooms_view',
    'create_chat_room_view',
    'chat_messages_view',
    'send_message_view',
    
    # Review views
    'tutor_reviews_view',
    'create_review_view',
    
    # Metadata views
    'subjects_list_view',
    'platform_stats_view',
]