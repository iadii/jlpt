from django.urls import path
from .views import tts_view

urlpatterns = [
    path('tts/', tts_view, name='tts'),
]
