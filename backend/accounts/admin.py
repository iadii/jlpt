from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_level', 'total_xp', 'daily_goal_minutes']
    list_filter = ['current_level']
    search_fields = ['user__username', 'user__email']
