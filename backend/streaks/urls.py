from django.urls import path
from . import views

urlpatterns = [
    path('current/', views.CurrentStreakView.as_view(), name='streak-current'),
    path('checkin/', views.CheckInView.as_view(), name='streak-checkin'),
    path('', views.CurrentStreakView.as_view(), name='streak-default'),
]

# Leaderboard URLs (included separately from config/urls.py)
leaderboard_urlpatterns = [
    path('weekly/', views.WeeklyLeaderboardView.as_view(), name='leaderboard-weekly'),
    path('monthly/', views.MonthlyLeaderboardView.as_view(), name='leaderboard-monthly'),
    path('all-time/', views.AllTimeLeaderboardView.as_view(), name='leaderboard-all-time'),
]
