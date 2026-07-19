"""Quiz — Mappers."""


class QuizMapper:

    @staticmethod
    def to_quiz_response(quiz_type, level, questions):
        return {
            'quiz_type': quiz_type,
            'level': level,
            'question_count': len(questions),
            'questions': questions,
        }

    @staticmethod
    def to_quiz_result(score, total, accuracy, xp_earned, corrections):
        return {
            'score': score,
            'total': total,
            'accuracy': round(accuracy, 1),
            'xp_earned': xp_earned,
            'corrections': corrections,
        }
