"""Streaks — Thin controller views."""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from shared.response import ApiResponse

from .services import StreakService, LeaderboardService
from .mappers import StreakMapper


class CurrentStreakView(APIView):
    """GET /api/streaks/current/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        streak = StreakService.get_streak(request.user)
        data = StreakMapper.to_streak_dto(streak)
        return ApiResponse.success(data)


class CheckInView(APIView):
    """POST /api/streaks/checkin/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message, streak = StreakService.checkin(request.user)
        data = StreakMapper.to_checkin_response(message, streak)
        return ApiResponse.success(data, message=message)


class WeeklyLeaderboardView(APIView):
    """GET /api/leaderboard/weekly/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = LeaderboardService.get_top_users()
        data = StreakMapper.to_leaderboard(profiles)
        return ApiResponse.success(data)


class MonthlyLeaderboardView(APIView):
    """GET /api/leaderboard/monthly/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = LeaderboardService.get_top_users()
        data = StreakMapper.to_leaderboard(profiles)
        return ApiResponse.success(data)


class AllTimeLeaderboardView(APIView):
    """GET /api/leaderboard/all-time/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = LeaderboardService.get_top_users()
        data = StreakMapper.to_leaderboard(profiles)
        return ApiResponse.success(data)
