from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.models import (
    CustomUser, 
    Subject, 
    StudentProfile, 
    TutorProfile, 
    TutorSubject,
    TutorLike, 
    TutorSave, 
    TutorView,
    ChatRoom, 
    Message,
    Review
)

@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'user_type', 'is_active', 'created_at')
    list_filter = ('user_type', 'is_active', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('user_type', 'phone', 'is_online', 'last_activity')}),
    )

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'grade', 'location')
    list_filter = ('grade',)
    search_fields = ('user__email', 'school', 'location')

@admin.register(TutorProfile)
class TutorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'education', 'price_min', 'price_max', 'rating_average', 'is_verified', 'location')
    list_filter = ('education', 'is_verified', 'location')
    ordering = ('-price_min',)
    search_fields = ('user__email', 'education', 'location')

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('student', 'tutor', 'created_at', 'last_message_at', 'is_active')
    list_filter = ('is_active', 'created_at')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat_room', 'sender', 'content', 'message_type', 'created_at')
    list_filter = ('message_type', 'created_at')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('student', 'tutor', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')