from django.contrib import admin
from .models import StudySession

@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_type', 'jlpt_level', 'start_time', 'accuracy_percentage', 'xp_earned']
    list_filter = ['session_type', 'jlpt_level']
    search_fields = ['user__username']
