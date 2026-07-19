from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended user profile for the Japanese learning app."""

    JLPT_LEVELS = [
        ('n5', 'N5 — Beginner'),
        ('n4', 'N4 — Elementary'),
        ('n3', 'N3 — Intermediate'),
        ('n2', 'N2 — Upper Intermediate'),
        ('n1', 'N1 — Advanced'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    current_level = models.CharField(max_length=2, choices=JLPT_LEVELS, default='n5')
    daily_goal_minutes = models.PositiveIntegerField(default=15)
    total_xp = models.PositiveIntegerField(default=0)
    preferred_language = models.CharField(max_length=5, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} — {self.get_current_level_display()}"


# Auto-create UserProfile when a new User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
