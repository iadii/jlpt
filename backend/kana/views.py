"""
Kana — Thin controller views.
"""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse
from shared.exceptions import NotFoundException

from .services import KanaService
from .mappers import KanaMapper


class HiraganaListView(APIView):
    """GET /api/kana/hiragana/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        kana_qs = KanaService.get_all_by_type('hiragana')
        data = KanaMapper.to_list(kana_qs)
        return ApiResponse.success(data)


class KatakanaListView(APIView):
    """GET /api/kana/katakana/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        kana_qs = KanaService.get_all_by_type('katakana')
        data = KanaMapper.to_list(kana_qs)
        return ApiResponse.success(data)


class HiraganaGroupView(APIView):
    """GET /api/kana/hiragana/<group>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, group):
        kana_qs = KanaService.get_by_type_and_group('hiragana', group)
        data = KanaMapper.to_list(kana_qs)
        return ApiResponse.success(data)


class KatakanaGroupView(APIView):
    """GET /api/kana/katakana/<group>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, group):
        kana_qs = KanaService.get_by_type_and_group('katakana', group)
        data = KanaMapper.to_list(kana_qs)
        return ApiResponse.success(data)


class KanaDetailView(APIView):
    """GET /api/kana/details/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            kana = KanaService.get_by_id(pk)
        except NotFoundException as e:
            return ApiResponse.not_found(e.message)
        data = KanaMapper.to_detail_dto(kana)
        return ApiResponse.success(data)
