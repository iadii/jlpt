from django.urls import path
from . import views

urlpatterns = [
    # Per-level
    path('n5/', views.VocabularyN5ListView.as_view(), name='vocab-n5'),
    path('n4/', views.VocabularyN4ListView.as_view(), name='vocab-n4'),
    path('n3/', views.VocabularyN3ListView.as_view(), name='vocab-n3'),
    path('n2/', views.VocabularyN2ListView.as_view(), name='vocab-n2'),
    path('n1/', views.VocabularyN1ListView.as_view(), name='vocab-n1'),

    # Detail
    path('details/<int:pk>/', views.VocabularyDetailView.as_view(), name='vocab-detail'),

    # Categories
    path('categories/', views.CategoryListView.as_view(), name='vocab-categories'),
    path('category/<str:category>/', views.CategoryWordsView.as_view(), name='vocab-category'),
]
