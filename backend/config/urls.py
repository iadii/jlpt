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

    # API endpoints v1
    path('api/v1/', include([
        path('', include('accounts.urls')),
        path('kana/', include('kana.urls')),
        path('words/', include('vocabulary.urls')),
        path('kanji/', include('kanji.urls')),
        path('grammar/', include('grammar.urls')),
        path('quiz/', include('quiz.urls')),
        path('progress/', include('progress.urls')),
        path('sessions/', include('sessions.urls')),
        path('streaks/', include('streaks.urls')),
        path('leaderboard/', include(leaderboard_urlpatterns)),
        path('shared/', include('shared.urls')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
