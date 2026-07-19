"""
Reusable pagination classes for the API.
"""
from rest_framework.pagination import CursorPagination


class StandardCursorPagination(CursorPagination):
    """Default cursor pagination — 50 items, ordered by difficulty."""
    page_size = 50
    ordering = 'difficulty_order'
    cursor_query_param = 'cursor'


class SessionCursorPagination(CursorPagination):
    """Pagination for session history — 20 items, newest first."""
    page_size = 20
    ordering = '-start_time'


class SmallCursorPagination(CursorPagination):
    """Smaller page for lightweight lists — 20 items."""
    page_size = 20
    ordering = 'id'
