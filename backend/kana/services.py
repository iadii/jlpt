"""
Kana — Service layer.
"""
from .models import Kana
from shared.exceptions import NotFoundException


class KanaService:

    @staticmethod
    def get_all_by_type(kana_type: str):
        return Kana.objects.filter(kana_type=kana_type)

    @staticmethod
    def get_by_type_and_group(kana_type: str, group: str):
        return Kana.objects.filter(kana_type=kana_type, group=group)

    @staticmethod
    def get_by_id(kana_id: int):
        try:
            return Kana.objects.get(pk=kana_id)
        except Kana.DoesNotExist:
            raise NotFoundException(f"Kana with id {kana_id} not found")
