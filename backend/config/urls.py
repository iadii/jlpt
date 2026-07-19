"""
Root URL configuration for the Japanese Learning App.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from streaks.urls import leaderboard_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include('accounts.urls')),
    path('api/kana/', include('kana.urls')),
    path('api/words/', include('vocabulary.urls')),
    path('api/kanji/', include('kanji.urls')),
    path('api/grammar/', include('grammar.urls')),
    path('api/quiz/', include('quiz.urls')),
    path('api/progress/', include('progress.urls')),
    path('api/sessions/', include('sessions.urls')),
    path('api/streaks/', include('streaks.urls')),
    path('api/leaderboard/', include(leaderboard_urlpatterns)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
