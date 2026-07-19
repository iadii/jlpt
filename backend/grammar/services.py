"""Grammar — Service layer."""
from .models import GrammarPoint
from shared.exceptions import NotFoundException


class GrammarService:

    @staticmethod
    def get_by_level(level: str):
        return GrammarPoint.objects.filter(jlpt_level=level)

    @staticmethod
    def get_by_id(grammar_id: int):
        try:
            return GrammarPoint.objects.get(pk=grammar_id)
        except GrammarPoint.DoesNotExist:
            raise NotFoundException(f"Grammar point with id {grammar_id} not found")
