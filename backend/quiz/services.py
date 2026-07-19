"""
Quiz — Service layer.
All quiz generation and scoring logic lives here.
No HTTP awareness.
"""
import random

from vocabulary.models import Vocabulary
from kana.models import Kana
from kanji.models import Kanji
from shared.exceptions import InsufficientDataException


class QuizService:
    """Generates quiz questions and scores answers."""

    NUM_QUESTIONS = 10
    NUM_OPTIONS = 4

    # -----------------------------------------------------------------------
    # Vocabulary quiz generation
    # -----------------------------------------------------------------------
    @staticmethod
    def generate_vocabulary_quiz(level: str):
        words = list(Vocabulary.objects.filter(jlpt_level=level))
        if len(words) < QuizService.NUM_OPTIONS:
            raise InsufficientDataException(f"Not enough vocabulary for {level.upper()} quiz")

        sample_size = min(QuizService.NUM_QUESTIONS, len(words))
        selected = random.sample(words, sample_size)
        questions = []

        for word in selected:
            wrong_pool = [w for w in words if w.id != word.id]
            wrong_choices = random.sample(wrong_pool, min(3, len(wrong_pool)))
            options = [word.meaning] + [w.meaning for w in wrong_choices]
            random.shuffle(options)

            display = word.kanji if word.kanji else word.kana
            questions.append({
                'word_id': word.id,
                'question': f'What does {display} ({word.kana}) mean?',
                'options': options,
                'audio_url': word.audio_url.url if word.audio_url else None,
            })

        return questions

    # -----------------------------------------------------------------------
    # Kana quiz generation
    # -----------------------------------------------------------------------
    @staticmethod
    def generate_kana_quiz(kana_type: str):
        kana_chars = list(Kana.objects.filter(kana_type=kana_type))
        if len(kana_chars) < QuizService.NUM_OPTIONS:
            raise InsufficientDataException(f"Not enough {kana_type} data for quiz")

        sample_size = min(QuizService.NUM_QUESTIONS, len(kana_chars))
        selected = random.sample(kana_chars, sample_size)
        questions = []

        for k in selected:
            wrong_pool = [c for c in kana_chars if c.id != k.id]
            wrong_choices = random.sample(wrong_pool, min(3, len(wrong_pool)))
            options = [k.romaji] + [w.romaji for w in wrong_choices]
            random.shuffle(options)

            questions.append({
                'word_id': k.id,
                'question': f'What is the romaji for {k.character}?',
                'options': options,
                'audio_url': k.audio_url.url if k.audio_url else None,
            })

        return questions

    # -----------------------------------------------------------------------
    # Kanji quiz generation
    # -----------------------------------------------------------------------
    @staticmethod
    def generate_kanji_quiz(level: str):
        kanji_chars = list(Kanji.objects.filter(jlpt_level=level))
        if len(kanji_chars) < QuizService.NUM_OPTIONS:
            raise InsufficientDataException(f"Not enough kanji for {level.upper()} quiz")

        sample_size = min(QuizService.NUM_QUESTIONS, len(kanji_chars))
        selected = random.sample(kanji_chars, sample_size)
        questions = []

        for k in selected:
            wrong_pool = [c for c in kanji_chars if c.id != k.id]
            wrong_choices = random.sample(wrong_pool, min(3, len(wrong_pool)))
            options = [k.meaning] + [w.meaning for w in wrong_choices]
            random.shuffle(options)

            questions.append({
                'word_id': k.id,
                'question': f'What does the kanji {k.character} mean?',
                'options': options,
                'audio_url': None,
            })

        return questions

    # -----------------------------------------------------------------------
    # Scoring
    # -----------------------------------------------------------------------
    @staticmethod
    def score_quiz(quiz_type: str, answers: list):
        """
        Score a submitted quiz. Returns (score, total, accuracy, xp_earned, corrections).
        """
        correct = sum(1 for a in answers if a['is_correct'])
        total = len(answers)
        accuracy = (correct / total * 100) if total > 0 else 0
        xp_earned = correct * 10

        corrections = []
        for answer in answers:
            if not answer['is_correct']:
                correct_answer = QuizService._lookup_correct_answer(quiz_type, answer['word_id'])
                corrections.append({
                    'word_id': answer['word_id'],
                    'correct_answer': correct_answer,
                    'user_answer': answer['user_answer'],
                })

        return correct, total, accuracy, xp_earned, corrections

    @staticmethod
    def _lookup_correct_answer(quiz_type: str, item_id: int) -> str:
        """Look up the correct answer for a quiz item."""
        try:
            if quiz_type == 'vocabulary':
                return Vocabulary.objects.get(id=item_id).meaning
            elif quiz_type == 'kana':
                return Kana.objects.get(id=item_id).romaji
            elif quiz_type == 'kanji':
                return Kanji.objects.get(id=item_id).meaning
        except Exception:
            return 'unknown'
        return 'unknown'

    @staticmethod
    def award_xp(user, xp: int):
        """Award XP to a user's profile."""
        profile = user.profile
        profile.total_xp += xp
        profile.save()

    @staticmethod
    def get_quiz_history(user, limit: int = 20):
        """Return past quiz sessions for a user."""
        from sessions.models import StudySession
        return list(
            StudySession.objects.filter(user=user, session_type='quiz')
            .values('id', 'jlpt_level', 'start_time', 'end_time',
                    'words_reviewed', 'accuracy_percentage', 'xp_earned')[:limit]
        )
