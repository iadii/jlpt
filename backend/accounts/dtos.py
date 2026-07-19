"""
Accounts — Output DTOs (Data Transfer Objects).
These serializers define the shape of API responses ONLY. Never used for input.
"""
from rest_framework import serializers


class TokenDTO(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class RegisterResponseDTO(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    username = serializers.CharField()
    tokens = TokenDTO()


class LoginResponseDTO(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    tokens = TokenDTO()


class UserProfileDTO(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    date_joined = serializers.DateTimeField()
    current_level = serializers.CharField()
    daily_goal_minutes = serializers.IntegerField()
    total_xp = serializers.IntegerField()
    preferred_language = serializers.CharField()
