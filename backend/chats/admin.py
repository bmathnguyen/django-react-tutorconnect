# chats/admin.py
from django.contrib import admin
from chats.models import ChatRoom, Message

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('student', 'tutor', 'created_at', 'last_message_at', 'is_active')
    list_filter = ('is_active', 'created_at')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat_room', 'sender', 'content', 'message_type', 'created_at')
    list_filter = ('message_type', 'created_at')
