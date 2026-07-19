"""
Quiz — Thin controller views.
"""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse
from shared.exceptions import InsufficientDataException

from .services import QuizService
from .mappers import QuizMapper
from .requests import QuizSubmitRequest


# ---------------------------------------------------------------------------
# Vocabulary quiz views
# ---------------------------------------------------------------------------

class BaseVocabQuizView(APIView):
    permission_classes = [IsAuthenticated]
    jlpt_level = None

    def get(self, request):
        try:
            questions = QuizService.generate_vocabulary_quiz(self.jlpt_level)
        except InsufficientDataException as e:
            return ApiResponse.error(message=e.message)
        data = QuizMapper.to_quiz_response('vocabulary', self.jlpt_level, questions)
        return ApiResponse.success(data)


class VocabQuizN5View(BaseVocabQuizView):
    jlpt_level = 'n5'


class VocabQuizN4View(BaseVocabQuizView):
    jlpt_level = 'n4'


class VocabQuizN3View(BaseVocabQuizView):
    jlpt_level = 'n3'


class VocabQuizN2View(BaseVocabQuizView):
    jlpt_level = 'n2'


class VocabQuizN1View(BaseVocabQuizView):
    jlpt_level = 'n1'


# ---------------------------------------------------------------------------
# Kana quiz views
# ---------------------------------------------------------------------------

class KanaQuizHiraganaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            questions = QuizService.generate_kana_quiz('hiragana')
        except InsufficientDataException as e:
            return ApiResponse.error(message=e.message)
        data = QuizMapper.to_quiz_response('kana', 'hiragana', questions)
        return ApiResponse.success(data)


class KanaQuizKatakanaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            questions = QuizService.generate_kana_quiz('katakana')
        except InsufficientDataException as e:
            return ApiResponse.error(message=e.message)
        data = QuizMapper.to_quiz_response('kana', 'katakana', questions)
        return ApiResponse.success(data)


# ---------------------------------------------------------------------------
# Kanji quiz views
# ---------------------------------------------------------------------------

class BaseKanjiQuizView(APIView):
    permission_classes = [IsAuthenticated]
    jlpt_level = None

    def get(self, request):
        try:
            questions = QuizService.generate_kanji_quiz(self.jlpt_level)
        except InsufficientDataException as e:
            return ApiResponse.error(message=e.message)
        data = QuizMapper.to_quiz_response('kanji', self.jlpt_level, questions)
        return ApiResponse.success(data)


class KanjiQuizN5View(BaseKanjiQuizView):
    jlpt_level = 'n5'


class KanjiQuizN4View(BaseKanjiQuizView):
    jlpt_level = 'n4'


class KanjiQuizN3View(BaseKanjiQuizView):
    jlpt_level = 'n3'


class KanjiQuizN2View(BaseKanjiQuizView):
    jlpt_level = 'n2'


class KanjiQuizN1View(BaseKanjiQuizView):
    jlpt_level = 'n1'


# ---------------------------------------------------------------------------
# Quiz submission & history
# ---------------------------------------------------------------------------

class QuizSubmitView(APIView):
    """POST /api/quiz/submit/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        req = QuizSubmitRequest(data=request.data)
        req.is_valid(raise_exception=True)
        data = req.validated_data

        score, total, accuracy, xp_earned, corrections = QuizService.score_quiz(
            data['quiz_type'], data['answers']
        )
        QuizService.award_xp(request.user, xp_earned)

        result = QuizMapper.to_quiz_result(score, total, accuracy, xp_earned, corrections)
        return ApiResponse.success(result)


class QuizHistoryView(APIView):
    """GET /api/quiz/history/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = QuizService.get_quiz_history(request.user)
        return ApiResponse.success(history)
