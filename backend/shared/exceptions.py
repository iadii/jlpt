"""
Custom exception classes for the application.
"""


class ServiceException(Exception):
    """Base exception for service-layer errors."""
    def __init__(self, message="A service error occurred", status_code=400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(ServiceException):
    """Raised when a requested resource is not found."""
    def __init__(self, message="Resource not found"):
        super().__init__(message=message, status_code=404)


class AuthenticationException(ServiceException):
    """Raised when authentication fails."""
    def __init__(self, message="Invalid credentials"):
        super().__init__(message=message, status_code=401)


class InsufficientDataException(ServiceException):
    """Raised when there isn't enough data (e.g., not enough words for a quiz)."""
    def __init__(self, message="Not enough data available"):
        super().__init__(message=message, status_code=400)
