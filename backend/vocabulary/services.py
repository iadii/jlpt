"""
Vocabulary — Service layer.
"""
from .models import Vocabulary
from shared.exceptions import NotFoundException


class VocabularyService:

    @staticmethod
    def get_by_level(level: str):
        return Vocabulary.objects.filter(jlpt_level=level)

    @staticmethod
    def get_by_id(vocab_id: int):
        try:
            return Vocabulary.objects.get(pk=vocab_id)
        except Vocabulary.DoesNotExist:
            raise NotFoundException(f"Vocabulary with id {vocab_id} not found")

    @staticmethod
    def get_categories():
        """Return list of categories with non-zero word counts."""
        categories = []
        for value, label in Vocabulary.CATEGORY_CHOICES:
            count = Vocabulary.objects.filter(category=value).count()
            if count > 0:
                categories.append({'category': value, 'label': label, 'count': count})
        return categories

    @staticmethod
    def get_by_category(category: str):
        return Vocabulary.objects.filter(category=category)
