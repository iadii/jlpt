"""Grammar — Thin controller views."""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse
from shared.pagination import StandardCursorPagination
from shared.exceptions import NotFoundException

from .services import GrammarService
from .mappers import GrammarMapper


class BaseGrammarLevelView(APIView):
    permission_classes = [IsAuthenticated]
    jlpt_level = None

    def get(self, request):
        queryset = GrammarService.get_by_level(self.jlpt_level)
        paginator = StandardCursorPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            data = GrammarMapper.to_list(page)
            return paginator.get_paginated_response(data)
        data = GrammarMapper.to_list(queryset)
        return ApiResponse.success(data)


class GrammarN5ListView(BaseGrammarLevelView):
    jlpt_level = 'n5'


class GrammarN4ListView(BaseGrammarLevelView):
    jlpt_level = 'n4'


class GrammarN3ListView(BaseGrammarLevelView):
    jlpt_level = 'n3'


class GrammarN2ListView(BaseGrammarLevelView):
    jlpt_level = 'n2'


class GrammarN1ListView(BaseGrammarLevelView):
    jlpt_level = 'n1'


class GrammarDetailView(APIView):
    """GET /api/grammar/details/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            gp = GrammarService.get_by_id(pk)
        except NotFoundException as e:
            return ApiResponse.not_found(e.message)
        data = GrammarMapper.to_detail_dto(gp)
        return ApiResponse.success(data)
