"""Grammar — Output DTOs."""
from rest_framework import serializers


class GrammarListDTO(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    structure = serializers.CharField()
    jlpt_level = serializers.CharField()
    difficulty_order = serializers.IntegerField()


class GrammarDetailDTO(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    explanation = serializers.CharField()
    structure = serializers.CharField()
    jlpt_level = serializers.CharField()
    example_sentences = serializers.JSONField()
    difficulty_order = serializers.IntegerField()
    created_at = serializers.DateTimeField()
