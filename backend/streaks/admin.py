from django.contrib import admin
from .models import UserStreak

@admin.register(UserStreak)
class UserStreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak', 'longest_streak', 'last_study_date']
    search_fields = ['user__username']
