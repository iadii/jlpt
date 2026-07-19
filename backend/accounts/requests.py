"""
Accounts — Input validation schemas.
These serializers validate incoming request data ONLY. Never used for output.
"""
from rest_framework import serializers


class RegisterRequest(serializers.Serializer):
    """POST /api/auth/register/"""
    email = serializers.EmailField()
    username = serializers.CharField(min_length=3, max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)


class LoginRequest(serializers.Serializer):
    """POST /api/auth/login/"""
    email = serializers.EmailField()
    password = serializers.CharField()


class ProfileUpdateRequest(serializers.Serializer):
    """PUT /api/users/profile/update/"""
    current_level = serializers.ChoiceField(
        choices=['n5', 'n4', 'n3', 'n2', 'n1'], required=False
    )
    daily_goal_minutes = serializers.IntegerField(min_value=5, max_value=240, required=False)
    preferred_language = serializers.CharField(max_length=5, required=False)


class LogoutRequest(serializers.Serializer):
    """POST /api/auth/logout/"""
    refresh = serializers.CharField()
