"""
Kanji — Mappers.
"""
from vocabulary.mappers import VocabularyMapper


class KanjiMapper:

    @staticmethod
    def to_list_dto(kanji):
        return {
            'id': kanji.id,
            'character': kanji.character,
            'onyomi': kanji.onyomi,
            'kunyomi': kanji.kunyomi,
            'meaning': kanji.meaning,
            'stroke_count': kanji.stroke_count,
            'jlpt_level': kanji.jlpt_level,
        }

    @staticmethod
    def to_detail_dto(kanji):
        return {
            'id': kanji.id,
            'character': kanji.character,
            'onyomi': kanji.onyomi,
            'kunyomi': kanji.kunyomi,
            'meaning': kanji.meaning,
            'stroke_count': kanji.stroke_count,
            'jlpt_level': kanji.jlpt_level,
            'stroke_order_image': kanji.stroke_order_image.url if kanji.stroke_order_image else None,
            'difficulty_order': kanji.difficulty_order,
            'example_words': [VocabularyMapper.to_list_dto(v) for v in kanji.example_words.all()],
        }

    @staticmethod
    def to_list(queryset):
        return [KanjiMapper.to_list_dto(k) for k in queryset]
