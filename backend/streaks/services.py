"""
Streaks — Service layer.
Streak logic and leaderboard queries.
"""
from datetime import date, timedelta

from .models import UserStreak
from accounts.models import UserProfile


class StreakService:

    @staticmethod
    def get_streak(user):
        streak, _ = UserStreak.objects.get_or_create(user=user)
        return streak

    @staticmethod
    def checkin(user):
        """
        Mark today as a study day.
        Returns (message, streak).
        """
        streak, _ = UserStreak.objects.get_or_create(user=user)
        today = date.today()

        if streak.last_study_date == today:
            return 'Already checked in today', streak

        if streak.last_study_date == today - timedelta(days=1):
            streak.current_streak += 1
        elif streak.last_study_date is None or streak.last_study_date < today - timedelta(days=1):
            streak.current_streak = 1

        streak.longest_streak = max(streak.longest_streak, streak.current_streak)
        streak.last_study_date = today
        streak.save()

        return 'Checked in!', streak


class LeaderboardService:

    @staticmethod
    def get_top_users(limit: int = 20):
        return UserProfile.objects.select_related('user').order_by('-total_xp')[:limit]
