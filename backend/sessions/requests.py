"""Sessions — Input request schemas."""
from rest_framework import serializers


class StartSessionRequest(serializers.Serializer):
    session_type = serializers.ChoiceField(choices=['vocabulary', 'kana', 'kanji', 'grammar', 'quiz'])
    jlpt_level = serializers.ChoiceField(choices=['n5', 'n4', 'n3', 'n2', 'n1'])


class CompleteSessionRequest(serializers.Serializer):
    words_reviewed = serializers.IntegerField(min_value=0)
    accuracy_percentage = serializers.FloatField(min_value=0, max_value=100)
