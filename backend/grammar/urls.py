from django.urls import path
from . import views

urlpatterns = [
    path('n5/', views.GrammarN5ListView.as_view(), name='grammar-n5'),
    path('n4/', views.GrammarN4ListView.as_view(), name='grammar-n4'),
    path('n3/', views.GrammarN3ListView.as_view(), name='grammar-n3'),
    path('n2/', views.GrammarN2ListView.as_view(), name='grammar-n2'),
    path('n1/', views.GrammarN1ListView.as_view(), name='grammar-n1'),
    path('details/<int:pk>/', views.GrammarDetailView.as_view(), name='grammar-detail'),
]
