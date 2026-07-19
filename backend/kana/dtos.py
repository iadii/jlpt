"""
Kana — Output DTOs.
"""
from rest_framework import serializers


class KanaListDTO(serializers.Serializer):
    id = serializers.IntegerField()
    character = serializers.CharField()
    romaji = serializers.CharField()
    kana_type = serializers.CharField()
    group = serializers.CharField()
    order = serializers.IntegerField()


class KanaDetailDTO(serializers.Serializer):
    id = serializers.IntegerField()
    character = serializers.CharField()
    romaji = serializers.CharField()
    kana_type = serializers.CharField()
    group = serializers.CharField()
    stroke_order_image = serializers.ImageField(allow_null=True)
    audio_url = serializers.FileField(allow_null=True)
    order = serializers.IntegerField()
