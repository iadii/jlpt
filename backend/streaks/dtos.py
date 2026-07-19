"""Streaks — Output DTOs."""
from rest_framework import serializers


class StreakDTO(serializers.Serializer):
    username = serializers.CharField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    last_study_date = serializers.DateField(allow_null=True)


class CheckInResponseDTO(serializers.Serializer):
    message = serializers.CharField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()


class LeaderboardEntryDTO(serializers.Serializer):
    rank = serializers.IntegerField()
    username = serializers.CharField()
    total_xp = serializers.IntegerField()
