from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.ProgressSummaryView.as_view(), name='progress-summary'),
    path('due-reviews/', views.DueReviewsView.as_view(), name='progress-due-reviews'),
    path('n5/', views.ProgressByLevelView.as_view(), {'level': 'n5'}, name='progress-n5'),
    path('n4/', views.ProgressByLevelView.as_view(), {'level': 'n4'}, name='progress-n4'),
    path('n3/', views.ProgressByLevelView.as_view(), {'level': 'n3'}, name='progress-n3'),
    path('n2/', views.ProgressByLevelView.as_view(), {'level': 'n2'}, name='progress-n2'),
    path('n1/', views.ProgressByLevelView.as_view(), {'level': 'n1'}, name='progress-n1'),
    path('record/<int:word_id>/', views.RecordProgressView.as_view(), name='progress-record'),
]
