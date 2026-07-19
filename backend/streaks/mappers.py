"""Streaks — Mappers."""


class StreakMapper:

    @staticmethod
    def to_streak_dto(streak):
        return {
            'username': streak.user.username,
            'current_streak': streak.current_streak,
            'longest_streak': streak.longest_streak,
            'last_study_date': streak.last_study_date,
        }

    @staticmethod
    def to_checkin_response(message, streak):
        return {
            'message': message,
            'current_streak': streak.current_streak,
            'longest_streak': streak.longest_streak,
        }

    @staticmethod
    def to_leaderboard(profiles):
        return [
            {
                'rank': idx + 1,
                'username': p.user.username,
                'total_xp': p.total_xp,
            }
            for idx, p in enumerate(profiles)
        ]
