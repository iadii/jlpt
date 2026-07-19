"""Sessions — Mappers."""


class SessionMapper:

    @staticmethod
    def to_start_response(session):
        return {
            'session_id': session.id,
            'session_type': session.session_type,
            'jlpt_level': session.jlpt_level,
            'start_time': session.start_time,
        }

    @staticmethod
    def to_session_dto(session):
        return {
            'id': session.id,
            'session_type': session.session_type,
            'jlpt_level': session.jlpt_level,
            'start_time': session.start_time,
            'end_time': session.end_time,
            'words_reviewed': session.words_reviewed,
            'accuracy_percentage': session.accuracy_percentage,
            'xp_earned': session.xp_earned,
        }

    @staticmethod
    def to_list(queryset):
        return [SessionMapper.to_session_dto(s) for s in queryset]
