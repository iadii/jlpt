"""Progress — Mappers."""


class ProgressMapper:

    @staticmethod
    def to_summary_dto(user, progress_qs):
        total_correct = sum(p.correct_count for p in progress_qs)
        total_incorrect = sum(p.incorrect_count for p in progress_qs)
        total_attempts = total_correct + total_incorrect
        overall_accuracy = (total_correct / total_attempts * 100) if total_attempts > 0 else 0

        return {
            'total_words_learned': progress_qs.filter(content_type='vocabulary').exclude(status='new').count(),
            'total_kana_mastered': progress_qs.filter(content_type='kana', status='mastered').count(),
            'total_kanji_learned': progress_qs.filter(content_type='kanji').exclude(status='new').count(),
            'total_grammar_learned': progress_qs.filter(content_type='grammar').exclude(status='new').count(),
            'overall_accuracy': round(overall_accuracy, 1),
            'total_xp': user.profile.total_xp,
            'current_level': user.profile.current_level,
        }

    @staticmethod
    def to_progress_dto(progress):
        return {
            'id': progress.id,
            'content_type': progress.content_type,
            'content_id': progress.content_id,
            'status': progress.status,
            'correct_count': progress.correct_count,
            'incorrect_count': progress.incorrect_count,
            'next_review_date': progress.next_review_date,
            'last_reviewed_at': progress.last_reviewed_at,
        }

    @staticmethod
    def to_progress_list(queryset):
        return [ProgressMapper.to_progress_dto(p) for p in queryset]

    @staticmethod
    def to_level_progress_dto(level, total_vocab, level_progress):
        mastered = level_progress.filter(status='mastered').count()
        return {
            'level': level,
            'total_items': total_vocab,
            'new': level_progress.filter(status='new').count(),
            'learning': level_progress.filter(status='learning').count(),
            'reviewing': level_progress.filter(status='reviewing').count(),
            'mastered': mastered,
            'started': level_progress.count(),
            'percentage': round(mastered / total_vocab * 100, 1) if total_vocab > 0 else 0,
        }

    @staticmethod
    def to_record_response(word_id, progress, xp_earned):
        return {
            'word_id': word_id,
            'new_status': progress.status,
            'next_review_date': str(progress.next_review_date),
            'interval_days': progress.interval_days,
            'xp_earned': xp_earned,
        }
