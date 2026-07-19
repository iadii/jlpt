"""
Vocabulary — Output DTOs.
"""
from rest_framework import serializers


class VocabularyListDTO(serializers.Serializer):
    id = serializers.IntegerField()
    kanji = serializers.CharField(allow_null=True)
    kana = serializers.CharField()
    romaji = serializers.CharField()
    meaning = serializers.CharField()
    jlpt_level = serializers.CharField()
    part_of_speech = serializers.CharField()
    category = serializers.CharField()


class VocabularyDetailDTO(serializers.Serializer):
    id = serializers.IntegerField()
    kanji = serializers.CharField(allow_null=True)
    kana = serializers.CharField()
    romaji = serializers.CharField()
    meaning = serializers.CharField()
    jlpt_level = serializers.CharField()
    part_of_speech = serializers.CharField()
    category = serializers.CharField()
    example_sentence_jp = serializers.CharField()
    example_sentence_en = serializers.CharField()
    audio_url = serializers.FileField(allow_null=True)
    difficulty_order = serializers.IntegerField()


class CategoryDTO(serializers.Serializer):
    category = serializers.CharField()
    label = serializers.CharField()
    count = serializers.IntegerField()
