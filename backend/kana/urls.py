from django.urls import path
from . import views

urlpatterns = [
    path('hiragana/', views.HiraganaListView.as_view(), name='kana-hiragana'),
    path('katakana/', views.KatakanaListView.as_view(), name='kana-katakana'),
    path('hiragana/<str:group>/', views.HiraganaGroupView.as_view(), name='kana-hiragana-group'),
    path('katakana/<str:group>/', views.KatakanaGroupView.as_view(), name='kana-katakana-group'),
    path('details/<int:pk>/', views.KanaDetailView.as_view(), name='kana-detail'),
]
