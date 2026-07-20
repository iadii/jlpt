"""
Accounts — Mappers.
Pure conversion functions: Model instances → DTO-compatible dicts.
No side effects. No DB queries. No HTTP awareness.
"""


class UserMapper:

    @staticmethod
    def to_register_response(user, tokens):
        return {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'tokens': {
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            },
        }

    @staticmethod
    def to_login_response(user, tokens):
        return {
            'id': user.id,
            'username': user.username,
            'tokens': {
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            },
        }

    @staticmethod
    def to_profile_dto(profile):
        return {
            'id': profile.user.id,
            'username': profile.user.username,
            'email': profile.user.email,
            'date_joined': profile.user.date_joined,
            'current_level': profile.current_level,
            'daily_goal_minutes': profile.daily_goal_minutes,
            'total_xp': profile.total_xp,
            'preferred_language': profile.preferred_language,
        }
