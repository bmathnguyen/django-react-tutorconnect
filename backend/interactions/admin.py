# interactions/admin.py
from django.contrib import admin
from interactions.models import TutorLike, TutorSave, TutorView

@admin.register(TutorLike)
class TutorLikeAdmin(admin.ModelAdmin):
    list_display = ('student', 'tutor', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('student__user__email', 'tutor__user__email')

@admin.register(TutorSave)
class TutorSaveAdmin(admin.ModelAdmin):
    list_display = ('student', 'tutor', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('student__user__email', 'tutor__user__email')

@admin.register(TutorView)
class TutorViewAdmin(admin.ModelAdmin):
    list_display = ('student', 'tutor', 'viewed_at')
    list_filter = ('viewed_at',)
    search_fields = ('student__user__email', 'tutor__user__email')
