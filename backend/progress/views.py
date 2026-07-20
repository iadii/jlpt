"""Progress — Thin controller views."""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse

from .services import ProgressService
from .mappers import ProgressMapper
from .requests import RecordProgressRequest


class ProgressSummaryView(APIView):
    """GET /api/progress/summary/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress_qs = ProgressService.get_summary(request.user)
        due_count = ProgressService.get_due_reviews(request.user).count()
        data = ProgressMapper.to_summary_dto(request.user, progress_qs, due_count)
        return ApiResponse.success(data)


class DueReviewsView(APIView):
    """GET /api/progress/due-reviews/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        due_items = ProgressService.get_due_reviews(request.user)
        data = ProgressMapper.to_progress_list(due_items)
        return ApiResponse.success(data)


class ProgressByLevelView(APIView):
    """GET /api/progress/<level>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, level):
        total_vocab, level_progress = ProgressService.get_level_progress(request.user, level)
        data = ProgressMapper.to_level_progress_dto(level, total_vocab, level_progress)
        return ApiResponse.success(data)


class RecordProgressView(APIView):
    """POST /api/progress/record/<word_id>/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, word_id):
        req = RecordProgressRequest(data=request.data)
        req.is_valid(raise_exception=True)

        progress, xp_earned = ProgressService.record_answer(
            user=request.user,
            word_id=word_id,
            content_type=req.validated_data['content_type'],
            is_correct=req.validated_data['is_correct'],
        )
        data = ProgressMapper.to_record_response(word_id, progress, xp_earned)
        return ApiResponse.success(data)
