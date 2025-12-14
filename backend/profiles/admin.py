# profiles/admin.py
from django.contrib import admin
from profiles.models import (
    StudentProfile, 
    TutorProfile, 
    TutorSubject,
    TutorSubjectTag,
    TutorAchievement,
    ClassLevel
)

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'grade', 'location')
    list_filter = ('grade',)
    search_fields = ('user__email', 'school', 'location')

class TutorSubjectInline(admin.TabularInline):
    model = TutorSubject
    extra = 1

@admin.register(TutorProfile)
class TutorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'education', 'price_min', 'price_max', 'rating_average', 'is_verified', 'location','uuid')
    list_filter = ('education', 'is_verified', 'location')
    ordering = ('-price_min',)
    search_fields = ('user__email', 'education', 'location',)
    inlines = [TutorSubjectInline]

@admin.register(TutorSubject)
class TutorSubjectAdmin(admin.ModelAdmin):
    list_display = ('tutor_profile', 'subject', 'level', 'price', 'id')
    search_fields = ('tutor_profile__user__email', 'subject__name')
    list_filter = ('subject', 'level')

@admin.register(TutorSubjectTag)
class TutorSubjectTagAdmin(admin.ModelAdmin):
    list_display = ('tutor_subject', 'tag', 'price', 'is_admin_tag', 'id')
    search_fields = ('tutor_subject__subject__name', 'tag')
    list_filter = ('is_admin_tag',)

@admin.register(TutorAchievement)
class TutorAchievementAdmin(admin.ModelAdmin):
    list_display = ('tutor_profile', 'title', 'is_featured')
    list_filter = ('is_featured',)
    search_fields = ('title', 'tutor_profile__user__email')

@admin.register(ClassLevel)
class ClassLevelAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
