"""Sessions — Thin controller views."""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse
from shared.pagination import SessionCursorPagination
from shared.exceptions import NotFoundException

from .services import SessionService
from .mappers import SessionMapper
from .requests import StartSessionRequest, CompleteSessionRequest


class StartSessionView(APIView):
    """POST /api/sessions/start/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        req = StartSessionRequest(data=request.data)
        req.is_valid(raise_exception=True)
        session = SessionService.start_session(request.user, **req.validated_data)
        data = SessionMapper.to_start_response(session)
        return ApiResponse.created(data, message="Session started")


class CompleteSessionView(APIView):
    """POST /api/sessions/complete/<session_id>/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        req = CompleteSessionRequest(data=request.data)
        req.is_valid(raise_exception=True)
        try:
            session = SessionService.complete_session(
                request.user, session_id, **req.validated_data
            )
        except NotFoundException as e:
            return ApiResponse.not_found(e.message)
        data = SessionMapper.to_session_dto(session)
        return ApiResponse.success(data, message="Session completed")


class SessionHistoryView(APIView):
    """GET /api/sessions/history/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = SessionService.get_history(request.user)
        paginator = SessionCursorPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            data = SessionMapper.to_list(page)
            return paginator.get_paginated_response(data)
        data = SessionMapper.to_list(queryset)
        return ApiResponse.success(data)
