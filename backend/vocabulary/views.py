"""
Vocabulary — Thin controller views.
"""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse
from shared.pagination import StandardCursorPagination
from shared.exceptions import NotFoundException

from .services import VocabularyService
from .mappers import VocabularyMapper
from .dtos import VocabularyListDTO


class BaseVocabularyLevelView(APIView):
    """Base class for per-level vocabulary list views with pagination."""
    permission_classes = [IsAuthenticated]
    jlpt_level = None

    def get(self, request):
        queryset = VocabularyService.get_by_level(self.jlpt_level)
        paginator = StandardCursorPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            data = VocabularyMapper.to_list(page)
            return paginator.get_paginated_response(data)
        data = VocabularyMapper.to_list(queryset)
        return ApiResponse.success(data)


class VocabularyN5ListView(BaseVocabularyLevelView):
    jlpt_level = 'n5'


class VocabularyN4ListView(BaseVocabularyLevelView):
    jlpt_level = 'n4'


class VocabularyN3ListView(BaseVocabularyLevelView):
    jlpt_level = 'n3'


class VocabularyN2ListView(BaseVocabularyLevelView):
    jlpt_level = 'n2'


class VocabularyN1ListView(BaseVocabularyLevelView):
    jlpt_level = 'n1'


class VocabularyDetailView(APIView):
    """GET /api/words/details/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            vocab = VocabularyService.get_by_id(pk)
        except NotFoundException as e:
            return ApiResponse.not_found(e.message)
        data = VocabularyMapper.to_detail_dto(vocab)
        return ApiResponse.success(data)


class CategoryListView(APIView):
    """GET /api/words/categories/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = VocabularyService.get_categories()
        return ApiResponse.success(categories)


class CategoryWordsView(APIView):
    """GET /api/words/category/<category>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, category):
        queryset = VocabularyService.get_by_category(category)
        paginator = StandardCursorPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            data = VocabularyMapper.to_list(page)
            return paginator.get_paginated_response(data)
        data = VocabularyMapper.to_list(queryset)
        return ApiResponse.success(data)
