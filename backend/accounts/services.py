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
    def login(username: str, password: str):
        """Authenticate user by email or username and return (user, tokens) tuple."""
        from django.db.models import Q
        try:
            user_obj = User.objects.get(Q(email=username) | Q(username=username))
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
        """Update profile and user fields and return the updated profile."""
        from django.db import IntegrityError
        
        profile = user.profile
        
        user_fields = ['username', 'email']
        user_needs_save = False
        
        for field in user_fields:
            if field in kwargs and kwargs[field] is not None:
                setattr(user, field, kwargs[field])
                user_needs_save = True
                
        if user_needs_save:
            try:
                user.save()
            except IntegrityError:
                raise ServiceException("Username or email is already in use by another account.")

        for field, value in kwargs.items():
            if field not in user_fields and hasattr(profile, field) and value is not None:
                setattr(profile, field, value)
        profile.save()
        return profile
