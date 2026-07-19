"""
Kanji — Service layer.
"""
from .models import Kanji
from shared.exceptions import NotFoundException


class KanjiService:

    @staticmethod
    def get_by_level(level: str):
        return Kanji.objects.filter(jlpt_level=level)

    @staticmethod
    def get_by_id(kanji_id: int):
        try:
            return Kanji.objects.prefetch_related('example_words').get(pk=kanji_id)
        except Kanji.DoesNotExist:
            raise NotFoundException(f"Kanji with id {kanji_id} not found")
