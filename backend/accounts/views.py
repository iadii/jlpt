"""
Accounts — Thin controller views.
Each method: validate input → call service → map to DTO → return response.
No business logic here.
"""
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from shared.response import ApiResponse
from shared.exceptions import ServiceException, AuthenticationException

from .requests import RegisterRequest, LoginRequest, ProfileUpdateRequest, LogoutRequest
from .services import AuthService, ProfileService
from .mappers import UserMapper


class RegisterView(APIView):
    """POST /api/auth/register/"""
    permission_classes = [AllowAny]

    def post(self, request):
        req = RegisterRequest(data=request.data)
        req.is_valid(raise_exception=True)
        try:
            user, tokens = AuthService.register(**req.validated_data)
        except ServiceException as e:
            return ApiResponse.error(message=e.message, status=e.status_code)
        data = UserMapper.to_register_response(user, tokens)
        return ApiResponse.created(data, message="Registration successful")


class LoginView(APIView):
    """POST /api/auth/login/"""
    permission_classes = [AllowAny]

    def post(self, request):
        req = LoginRequest(data=request.data)
        req.is_valid(raise_exception=True)
        try:
            user, tokens = AuthService.login(**req.validated_data)
        except AuthenticationException as e:
            return ApiResponse.unauthorized(message=e.message)
        data = UserMapper.to_login_response(user, tokens)
        return ApiResponse.success(data, message="Login successful")


class LogoutView(APIView):
    """POST /api/auth/logout/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        req = LogoutRequest(data=request.data)
        req.is_valid(raise_exception=True)
        try:
            AuthService.logout(req.validated_data['refresh'])
        except ServiceException as e:
            return ApiResponse.error(message=e.message)
        return ApiResponse.success(message="Logged out successfully")


class ProfileView(APIView):
    """GET /api/users/profile/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = ProfileService.get_profile(request.user)
        data = UserMapper.to_profile_dto(profile)
        return ApiResponse.success(data)


class ProfileUpdateView(APIView):
    """PUT /api/users/profile/update/"""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        req = ProfileUpdateRequest(data=request.data)
        req.is_valid(raise_exception=True)
        profile = ProfileService.update_profile(request.user, **req.validated_data)
        data = UserMapper.to_profile_dto(profile)
        return ApiResponse.success(data, message="Profile updated")
