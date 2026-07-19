"""
Kanji — Output DTOs.
"""
from rest_framework import serializers
from vocabulary.dtos import VocabularyListDTO


class KanjiListDTO(serializers.Serializer):
    id = serializers.IntegerField()
    character = serializers.CharField()
    onyomi = serializers.CharField()
    kunyomi = serializers.CharField()
    meaning = serializers.CharField()
    stroke_count = serializers.IntegerField()
    jlpt_level = serializers.CharField()


class KanjiDetailDTO(serializers.Serializer):
    id = serializers.IntegerField()
    character = serializers.CharField()
    onyomi = serializers.CharField()
    kunyomi = serializers.CharField()
    meaning = serializers.CharField()
    stroke_count = serializers.IntegerField()
    jlpt_level = serializers.CharField()
    stroke_order_image = serializers.ImageField(allow_null=True)
    difficulty_order = serializers.IntegerField()
    example_words = VocabularyListDTO(many=True)
