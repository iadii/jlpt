"""
Progress — Service layer.
SRS algorithm and progress tracking logic.
"""
from datetime import date, timedelta
from django.utils import timezone

from .models import UserProgress
from vocabulary.models import Vocabulary


class ProgressService:

    @staticmethod
    def get_summary(user):
        """Return all progress records for summary computation."""
        return UserProgress.objects.filter(user=user)

    @staticmethod
    def get_due_reviews(user):
        """Return items due for review today."""
        today = date.today()
        return UserProgress.objects.filter(
            user=user,
            next_review_date__lte=today,
        ).exclude(status='mastered')

    @staticmethod
    def get_level_progress(user, level: str):
        """Return progress data for a specific JLPT level."""
        total_vocab = Vocabulary.objects.filter(jlpt_level=level).count()
        vocab_ids = list(Vocabulary.objects.filter(jlpt_level=level).values_list('id', flat=True))
        level_progress = UserProgress.objects.filter(
            user=user,
            content_type='vocabulary',
            content_id__in=vocab_ids,
        )
        return total_vocab, level_progress

    @staticmethod
    def record_answer(user, word_id: int, content_type: str, is_correct: bool):
        """
        Record a correct/incorrect answer and update the SRS algorithm.
        Returns (progress, xp_earned).
        """
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            content_type=content_type,
            content_id=word_id,
        )

        # Update counts
        if is_correct:
            progress.correct_count += 1
        else:
            progress.incorrect_count += 1

        # SM-2 inspired SRS algorithm
        if is_correct:
            if progress.interval_days == 0:
                progress.interval_days = 1
                progress.status = 'learning'
            elif progress.interval_days == 1:
                progress.interval_days = 3
                progress.status = 'reviewing'
            else:
                progress.interval_days = int(progress.interval_days * progress.ease_factor)
                if progress.interval_days > 30:
                    progress.status = 'mastered'
            progress.ease_factor = min(progress.ease_factor + 0.1, 3.0)
        else:
            progress.interval_days = 1
            progress.ease_factor = max(progress.ease_factor - 0.2, 1.3)
            if progress.status == 'mastered':
                progress.status = 'reviewing'

        progress.next_review_date = date.today() + timedelta(days=progress.interval_days)
        progress.last_reviewed_at = timezone.now()
        progress.save()

        # Award XP
        xp_earned = 10 if is_correct else 2
        profile = user.profile
        profile.total_xp += xp_earned
        profile.save()

        return progress, xp_earned
