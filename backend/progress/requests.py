"""Progress — Input request schemas."""
from rest_framework import serializers


class RecordProgressRequest(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=['vocabulary', 'kana', 'kanji', 'grammar'])
    is_correct = serializers.BooleanField()
    response_time_ms = serializers.IntegerField(required=False, default=0)
