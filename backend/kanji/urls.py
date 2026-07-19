from django.urls import path
from . import views

urlpatterns = [
    path('n5/', views.KanjiN5ListView.as_view(), name='kanji-n5'),
    path('n4/', views.KanjiN4ListView.as_view(), name='kanji-n4'),
    path('n3/', views.KanjiN3ListView.as_view(), name='kanji-n3'),
    path('n2/', views.KanjiN2ListView.as_view(), name='kanji-n2'),
    path('n1/', views.KanjiN1ListView.as_view(), name='kanji-n1'),
    path('details/<int:pk>/', views.KanjiDetailView.as_view(), name='kanji-detail'),
]
