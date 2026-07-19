from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.StartSessionView.as_view(), name='session-start'),
    path('complete/<int:session_id>/', views.CompleteSessionView.as_view(), name='session-complete'),
    path('history/', views.SessionHistoryView.as_view(), name='session-history'),
]
