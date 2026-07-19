"""Sessions — Output DTOs."""
from rest_framework import serializers


class SessionDTO(serializers.Serializer):
    id = serializers.IntegerField()
    session_type = serializers.CharField()
    jlpt_level = serializers.CharField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField(allow_null=True)
    words_reviewed = serializers.IntegerField()
    accuracy_percentage = serializers.FloatField()
    xp_earned = serializers.IntegerField()


class StartSessionResponseDTO(serializers.Serializer):
    session_id = serializers.IntegerField()
    session_type = serializers.CharField()
    jlpt_level = serializers.CharField()
    start_time = serializers.DateTimeField()
