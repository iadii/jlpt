"""Grammar — Mappers."""


class GrammarMapper:

    @staticmethod
    def to_list_dto(gp):
        return {
            'id': gp.id,
            'title': gp.title,
            'explanation': gp.explanation,
            'structure': gp.structure,
            'jlpt_level': gp.jlpt_level,
            'example_sentences': gp.example_sentences,
            'difficulty_order': gp.difficulty_order,
        }

    @staticmethod
    def to_detail_dto(gp):
        return {
            'id': gp.id,
            'title': gp.title,
            'explanation': gp.explanation,
            'structure': gp.structure,
            'jlpt_level': gp.jlpt_level,
            'example_sentences': gp.example_sentences,
            'difficulty_order': gp.difficulty_order,
            'created_at': gp.created_at,
        }

    @staticmethod
    def to_list(queryset):
        return [GrammarMapper.to_list_dto(g) for g in queryset]
