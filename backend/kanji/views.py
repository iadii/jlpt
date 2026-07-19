"""
Kanji — Thin controller views.
"""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse
from shared.pagination import StandardCursorPagination
from shared.exceptions import NotFoundException

from .services import KanjiService
from .mappers import KanjiMapper


class BaseKanjiLevelView(APIView):
    permission_classes = [IsAuthenticated]
    jlpt_level = None

    def get(self, request):
        queryset = KanjiService.get_by_level(self.jlpt_level)
        paginator = StandardCursorPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            data = KanjiMapper.to_list(page)
            return paginator.get_paginated_response(data)
        data = KanjiMapper.to_list(queryset)
        return ApiResponse.success(data)


class KanjiN5ListView(BaseKanjiLevelView):
    jlpt_level = 'n5'


class KanjiN4ListView(BaseKanjiLevelView):
    jlpt_level = 'n4'


class KanjiN3ListView(BaseKanjiLevelView):
    jlpt_level = 'n3'


class KanjiN2ListView(BaseKanjiLevelView):
    jlpt_level = 'n2'


class KanjiN1ListView(BaseKanjiLevelView):
    jlpt_level = 'n1'


class KanjiDetailView(APIView):
    """GET /api/kanji/details/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            kanji = KanjiService.get_by_id(pk)
        except NotFoundException as e:
            return ApiResponse.not_found(e.message)
        data = KanjiMapper.to_detail_dto(kanji)
        return ApiResponse.success(data)
