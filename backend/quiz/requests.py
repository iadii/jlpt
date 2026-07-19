"""Quiz — Input request schemas."""
from rest_framework import serializers


class QuizAnswerRequest(serializers.Serializer):
    word_id = serializers.IntegerField()
    user_answer = serializers.CharField()
    is_correct = serializers.BooleanField()


class QuizSubmitRequest(serializers.Serializer):
    quiz_type = serializers.ChoiceField(choices=['vocabulary', 'kana', 'kanji'])
    level = serializers.CharField()
    answers = QuizAnswerRequest(many=True)
