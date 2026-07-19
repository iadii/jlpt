from django.db import models
from django.contrib.auth.models import User


class StudySession(models.Model):
    """Tracks individual study sessions for analytics."""

    SESSION_TYPE_CHOICES = [
        ('vocabulary', 'Vocabulary'),
        ('kana', 'Kana'),
        ('kanji', 'Kanji'),
        ('grammar', 'Grammar'),
        ('quiz', 'Quiz'),
    ]

    JLPT_LEVELS = [
        ('n5', 'N5'), ('n4', 'N4'), ('n3', 'N3'), ('n2', 'N2'), ('n1', 'N1'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES)
    jlpt_level = models.CharField(max_length=2, choices=JLPT_LEVELS)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    words_reviewed = models.PositiveIntegerField(default=0)
    accuracy_percentage = models.FloatField(default=0.0)
    xp_earned = models.PositiveIntegerField(default=0)

    class Meta:
        app_label = 'study_sessions'
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.user.username} — {self.session_type} ({self.jlpt_level.upper()}) — {self.start_time.strftime('%Y-%m-%d')}"
