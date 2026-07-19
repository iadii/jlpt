"""
Vocabulary — Mappers.
"""


class VocabularyMapper:

    @staticmethod
    def to_list_dto(vocab):
        return {
            'id': vocab.id,
            'kanji': vocab.kanji,
            'kana': vocab.kana,
            'romaji': vocab.romaji,
            'meaning': vocab.meaning,
            'jlpt_level': vocab.jlpt_level,
            'part_of_speech': vocab.part_of_speech,
            'category': vocab.category,
        }

    @staticmethod
    def to_detail_dto(vocab):
        return {
            'id': vocab.id,
            'kanji': vocab.kanji,
            'kana': vocab.kana,
            'romaji': vocab.romaji,
            'meaning': vocab.meaning,
            'jlpt_level': vocab.jlpt_level,
            'part_of_speech': vocab.part_of_speech,
            'category': vocab.category,
            'example_sentence_jp': vocab.example_sentence_jp,
            'example_sentence_en': vocab.example_sentence_en,
            'audio_url': vocab.audio_url.url if vocab.audio_url else None,
            'difficulty_order': vocab.difficulty_order,
        }

    @staticmethod
    def to_list(queryset):
        return [VocabularyMapper.to_list_dto(v) for v in queryset]

    @staticmethod
    def to_category_dto(category_value, category_label, count):
        return {
            'category': category_value,
            'label': category_label,
            'count': count,
        }
