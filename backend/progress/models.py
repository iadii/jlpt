from django.db import models
from django.contrib.auth.models import User


class UserProgress(models.Model):
    """Tracks user progress on any content item with SRS (Spaced Repetition)."""

    CONTENT_TYPE_CHOICES = [
        ('vocabulary', 'Vocabulary'),
        ('kana', 'Kana'),
        ('kanji', 'Kanji'),
        ('grammar', 'Grammar'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('learning', 'Learning'),
        ('reviewing', 'Reviewing'),
        ('mastered', 'Mastered'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_records')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    content_id = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    correct_count = models.PositiveIntegerField(default=0)
    incorrect_count = models.PositiveIntegerField(default=0)
    ease_factor = models.FloatField(default=2.5, help_text="SRS ease factor")
    interval_days = models.PositiveIntegerField(default=0, help_text="Current SRS interval in days")
    next_review_date = models.DateField(null=True, blank=True)
    last_reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'content_type', 'content_id']
        ordering = ['next_review_date']

    def __str__(self):
        return f"{self.user.username} — {self.content_type}:{self.content_id} ({self.status})"
