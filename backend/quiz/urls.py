from django.urls import path
from . import views

urlpatterns = [
    # Vocabulary quizzes
    path('vocabulary/n5/', views.VocabQuizN5View.as_view(), name='quiz-vocab-n5'),
    path('vocabulary/n4/', views.VocabQuizN4View.as_view(), name='quiz-vocab-n4'),
    path('vocabulary/n3/', views.VocabQuizN3View.as_view(), name='quiz-vocab-n3'),
    path('vocabulary/n2/', views.VocabQuizN2View.as_view(), name='quiz-vocab-n2'),
    path('vocabulary/n1/', views.VocabQuizN1View.as_view(), name='quiz-vocab-n1'),

    # Kana quizzes
    path('kana/hiragana/', views.KanaQuizHiraganaView.as_view(), name='quiz-kana-hiragana'),
    path('kana/katakana/', views.KanaQuizKatakanaView.as_view(), name='quiz-kana-katakana'),

    # Kanji quizzes
    path('kanji/n5/', views.KanjiQuizN5View.as_view(), name='quiz-kanji-n5'),
    path('kanji/n4/', views.KanjiQuizN4View.as_view(), name='quiz-kanji-n4'),
    path('kanji/n3/', views.KanjiQuizN3View.as_view(), name='quiz-kanji-n3'),
    path('kanji/n2/', views.KanjiQuizN2View.as_view(), name='quiz-kanji-n2'),
    path('kanji/n1/', views.KanjiQuizN1View.as_view(), name='quiz-kanji-n1'),

    # Submit & history
    path('submit/', views.QuizSubmitView.as_view(), name='quiz-submit'),
    path('history/', views.QuizHistoryView.as_view(), name='quiz-history'),
]
