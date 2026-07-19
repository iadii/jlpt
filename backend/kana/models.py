from django.db import models


class Kana(models.Model):
    """Hiragana and Katakana characters."""

    KANA_TYPE_CHOICES = [
        ('hiragana', 'Hiragana'),
        ('katakana', 'Katakana'),
    ]

    GROUP_CHOICES = [
        ('a-row', 'A Row (あ行)'),
        ('ka-row', 'Ka Row (か行)'),
        ('sa-row', 'Sa Row (さ行)'),
        ('ta-row', 'Ta Row (た行)'),
        ('na-row', 'Na Row (な行)'),
        ('ha-row', 'Ha Row (は行)'),
        ('ma-row', 'Ma Row (ま行)'),
        ('ya-row', 'Ya Row (や行)'),
        ('ra-row', 'Ra Row (ら行)'),
        ('wa-row', 'Wa Row (わ行)'),
        ('n-row', 'N Row (ん)'),
    ]

    character = models.CharField(max_length=5)
    romaji = models.CharField(max_length=10)
    kana_type = models.CharField(max_length=10, choices=KANA_TYPE_CHOICES)
    group = models.CharField(max_length=10, choices=GROUP_CHOICES)
    stroke_order_image = models.ImageField(upload_to='kana/strokes/', blank=True, null=True)
    audio_url = models.FileField(upload_to='kana/audio/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text='Display order within group')

    class Meta:
        ordering = ['kana_type', 'order']
        unique_together = ['character', 'kana_type']

    def __str__(self):
        return f"{self.character} ({self.romaji}) — {self.kana_type}"
