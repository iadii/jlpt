from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserStreak(models.Model):
    """Tracks daily study streaks for gamification."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='streak')
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_study_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} — {self.current_streak} day streak"


# Auto-create UserStreak when a new User is created
@receiver(post_save, sender=User)
def create_user_streak(sender, instance, created, **kwargs):
    if created:
        UserStreak.objects.create(user=instance)
