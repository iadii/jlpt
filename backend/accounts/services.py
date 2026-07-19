"""
Accounts — Service layer.
ALL business logic for authentication and user management.
No HTTP awareness. Receives plain args, returns Python objects.
"""
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from shared.exceptions import AuthenticationException, ServiceException


class AuthService:
    """Handles registration, login, and logout."""

    @staticmethod
    def register(email: str, username: str, password: str):
        """Create a new user and return (user, tokens) tuple."""
        if User.objects.filter(email=email).exists():
            raise ServiceException("A user with this email already exists")
        if User.objects.filter(username=username).exists():
            raise ServiceException("A user with this username already exists")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        tokens = RefreshToken.for_user(user)
        return user, tokens

    @staticmethod
    def login(email: str, password: str):
        """Authenticate user by email and return (user, tokens) tuple."""
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationException()

        user = authenticate(username=user_obj.username, password=password)
        if user is None:
            raise AuthenticationException()

        tokens = RefreshToken.for_user(user)
        return user, tokens

    @staticmethod
    def logout(refresh_token: str):
        """Blacklist a refresh token."""
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            raise ServiceException("Invalid or expired token")


class ProfileService:
    """Handles user profile read/update."""

    @staticmethod
    def get_profile(user):
        """Return the UserProfile instance for a user."""
        return user.profile

    @staticmethod
    def update_profile(user, **kwargs):
        """Update profile fields and return the updated profile."""
        profile = user.profile
        for field, value in kwargs.items():
            if hasattr(profile, field) and value is not None:
                setattr(profile, field, value)
        profile.save()
        return profile
