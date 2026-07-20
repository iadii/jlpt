from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.utils.translation import gettext_lazy as _

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that reads the JWT from an HttpOnly cookie
    rather than the Authorization header.
    """
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        
        # Also support the standard Authorization header as fallback for testing/scripts
        if raw_token is None:
            header = self.get_header(request)
            if header is not None:
                raw_token = self.get_raw_token(header)
                
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, AuthenticationFailed):
            return None
