# chats/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Chat endpoints
    path('chats/', views.chat_rooms_view, name='chat-rooms'),
    path('chats/create/', views.create_chat_room_view, name='create-chat'),
    path('chats/<uuid:room_id>/messages/', views.chat_messages_view, name='chat-messages'),
    path('chats/<uuid:room_id>/send/', views.send_message_view, name='send-message'),
]

