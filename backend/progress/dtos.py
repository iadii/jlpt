"""Progress — Output DTOs."""
from rest_framework import serializers


class ProgressSummaryDTO(serializers.Serializer):
    total_words_learned = serializers.IntegerField()
    total_kana_mastered = serializers.IntegerField()
    total_kanji_learned = serializers.IntegerField()
    total_grammar_learned = serializers.IntegerField()
    overall_accuracy = serializers.FloatField()
    total_xp = serializers.IntegerField()
    current_level = serializers.CharField()


class UserProgressDTO(serializers.Serializer):
    id = serializers.IntegerField()
    content_type = serializers.CharField()
    content_id = serializers.IntegerField()
    status = serializers.CharField()
    correct_count = serializers.IntegerField()
    incorrect_count = serializers.IntegerField()
    next_review_date = serializers.DateField(allow_null=True)
    last_reviewed_at = serializers.DateTimeField(allow_null=True)


class LevelProgressDTO(serializers.Serializer):
    level = serializers.CharField()
    total_items = serializers.IntegerField()
    new = serializers.IntegerField()
    learning = serializers.IntegerField()
    reviewing = serializers.IntegerField()
    mastered = serializers.IntegerField()
    started = serializers.IntegerField()
    percentage = serializers.FloatField()


class RecordProgressResponseDTO(serializers.Serializer):
    word_id = serializers.IntegerField()
    new_status = serializers.CharField()
    next_review_date = serializers.CharField()
    interval_days = serializers.IntegerField()
    xp_earned = serializers.IntegerField()
