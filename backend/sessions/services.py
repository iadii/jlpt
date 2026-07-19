"""
Sessions — Service layer.
"""
from django.utils import timezone

from .models import StudySession
from shared.exceptions import NotFoundException


class SessionService:

    @staticmethod
    def start_session(user, session_type: str, jlpt_level: str):
        return StudySession.objects.create(
            user=user,
            session_type=session_type,
            jlpt_level=jlpt_level,
        )

    @staticmethod
    def complete_session(user, session_id: int, words_reviewed: int, accuracy_percentage: float):
        try:
            session = StudySession.objects.get(id=session_id, user=user)
        except StudySession.DoesNotExist:
            raise NotFoundException(f"Session {session_id} not found")

        session.end_time = timezone.now()
        session.words_reviewed = words_reviewed
        session.accuracy_percentage = accuracy_percentage

        # Calculate XP based on performance
        xp = int(words_reviewed * (accuracy_percentage / 100) * 5)
        session.xp_earned = xp
        session.save()

        # Update user total XP
        profile = user.profile
        profile.total_xp += xp
        profile.save()

        return session

    @staticmethod
    def get_history(user):
        return StudySession.objects.filter(user=user)
