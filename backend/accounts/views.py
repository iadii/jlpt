"""
Accounts — Thin controller views.
Each method: validate input → call service → map to DTO → return response.
No business logic here.
"""
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.conf import settings
from shared.response import ApiResponse
from shared.exceptions import ServiceException, AuthenticationException

from .requests import RegisterRequest, LoginRequest, ProfileUpdateRequest
from .services import AuthService, ProfileService
from .mappers import UserMapper


def _set_auth_cookies(response, tokens):
    access_token = str(tokens.access_token)
    refresh_token = str(tokens)
    
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite='Lax',
        max_age=30 * 60
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite='Lax',
        max_age=7 * 24 * 60 * 60
    )


class RegisterView(APIView):
    """POST /api/auth/register/"""
    permission_classes = [AllowAny]

    def post(self, request):
        req = RegisterRequest(data=request.data)
        req.is_valid(raise_exception=True)
        try:
            user, tokens = AuthService.register(**req.validated_data)
        except ServiceException as e:
            return ApiResponse.error(message=e.message, status_code=e.status_code)
        
        # Don't send tokens in JSON body anymore, just user data
        data = UserMapper.to_profile_dto(user.profile) 
        
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
            
        data = UserMapper.to_profile_dto(user.profile)
        response = ApiResponse.success(data, message="Login successful")
        _set_auth_cookies(response, tokens)
        return response


class CookieTokenRefreshView(APIView):
    """POST /api/auth/refresh/"""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.COOKIES.get('refresh_token')
        if not refresh:
            return ApiResponse.unauthorized(message="No refresh token provided")
            
        try:
            token = RefreshToken(refresh)
            access = str(token.access_token)
        except TokenError:
            return ApiResponse.unauthorized(message="Token is invalid or expired")
            
        response = ApiResponse.success(message="Token refreshed")
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite='Lax',
            max_age=30 * 60
        )
        return response


class LogoutView(APIView):
    """POST /api/auth/logout/"""
    permission_classes = [AllowAny] # Change to AllowAny so we can clear cookies even if token expired

    def post(self, request):
        refresh = request.COOKIES.get('refresh_token')
        if refresh:
            try:
                AuthService.logout(refresh)
            except ServiceException:
                pass # Ignore if already invalid
                
        response = ApiResponse.success(message="Logged out successfully")
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


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
