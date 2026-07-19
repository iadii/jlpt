from django.db import models


class Kanji(models.Model):
    """Individual kanji characters with readings and meanings."""

    JLPT_LEVELS = [
        ('n5', 'N5'), ('n4', 'N4'), ('n3', 'N3'), ('n2', 'N2'), ('n1', 'N1'),
    ]

    character = models.CharField(max_length=5, unique=True)
    onyomi = models.CharField(max_length=100, blank=True, default='', help_text="Chinese reading (カタカナ)")
    kunyomi = models.CharField(max_length=100, blank=True, default='', help_text="Japanese reading (ひらがな)")
    meaning = models.CharField(max_length=255)
    stroke_count = models.PositiveIntegerField(default=1)
    jlpt_level = models.CharField(max_length=2, choices=JLPT_LEVELS, db_index=True)
    stroke_order_image = models.ImageField(upload_to='kanji/strokes/', blank=True, null=True)
    example_words = models.ManyToManyField(
        'vocabulary.Vocabulary',
        related_name='kanji_set',
        blank=True,
    )
    difficulty_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['jlpt_level', 'difficulty_order']
        verbose_name_plural = 'Kanji'

    def __str__(self):
        return f"{self.character} ({self.meaning}) — {self.jlpt_level.upper()}"
