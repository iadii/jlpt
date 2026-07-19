"""Quiz — Output DTOs."""
from rest_framework import serializers


class QuizQuestionDTO(serializers.Serializer):
    word_id = serializers.IntegerField()
    question = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField())
    audio_url = serializers.CharField(allow_null=True)


class QuizDTO(serializers.Serializer):
    quiz_type = serializers.CharField()
    level = serializers.CharField()
    question_count = serializers.IntegerField()
    questions = QuizQuestionDTO(many=True)


class CorrectionDTO(serializers.Serializer):
    word_id = serializers.IntegerField()
    correct_answer = serializers.CharField()
    user_answer = serializers.CharField()


class QuizResultDTO(serializers.Serializer):
    score = serializers.IntegerField()
    total = serializers.IntegerField()
    accuracy = serializers.FloatField()
    xp_earned = serializers.IntegerField()
    corrections = CorrectionDTO(many=True)
