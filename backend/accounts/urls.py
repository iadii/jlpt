from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='auth-register'),
    path('auth/login/', views.LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', views.CookieTokenRefreshView.as_view(), name='auth-refresh'),
    path('auth/logout/', views.LogoutView.as_view(), name='auth-logout'),

    # User profile
    path('users/profile/', views.ProfileView.as_view(), name='user-profile'),
    path('users/profile/update/', views.ProfileUpdateView.as_view(), name='user-profile-update'),
]
