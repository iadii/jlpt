"""
Standardized API response wrappers.
All views should return responses through these helpers to ensure
a consistent JSON envelope across the entire API.
"""
from rest_framework.response import Response
from rest_framework import status as http_status


class ApiResponse:
    """Standardized response envelope for all API endpoints."""

    @staticmethod
    def success(data=None, message="Success", status=http_status.HTTP_200_OK):
        return Response({
            'status': 'success',
            'message': message,
            'data': data,
        }, status=status)

    @staticmethod
    def created(data=None, message="Created successfully"):
        return Response({
            'status': 'success',
            'message': message,
            'data': data,
        }, status=http_status.HTTP_201_CREATED)

    @staticmethod
    def error(message="Something went wrong", errors=None, status=http_status.HTTP_400_BAD_REQUEST, status_code=None):
        http_stat = status_code if status_code is not None else status
        return Response({
            'status': 'error',
            'message': message,
            'errors': errors,
        }, status=http_stat)

    @staticmethod
    def not_found(message="Resource not found"):
        return Response({
            'status': 'error',
            'message': message,
        }, status=http_status.HTTP_404_NOT_FOUND)

    @staticmethod
    def unauthorized(message="Invalid credentials"):
        return Response({
            'status': 'error',
            'message': message,
        }, status=http_status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def paginated(paginator, queryset, request, dto_class):
        """
        Helper for paginated list endpoints.
        Paginates the queryset and serializes with the given DTO.
        """
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = dto_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = dto_class(queryset, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data,
        })
