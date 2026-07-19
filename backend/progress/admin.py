from django.contrib import admin
from .models import UserProgress

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'content_id', 'status', 'correct_count', 'incorrect_count', 'next_review_date']
    list_filter = ['status', 'content_type']
    search_fields = ['user__username']
