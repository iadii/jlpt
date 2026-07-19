from django.db import models


class GrammarPoint(models.Model):
    """Grammar patterns organized by JLPT level."""

    JLPT_LEVELS = [
        ('n5', 'N5'), ('n4', 'N4'), ('n3', 'N3'), ('n2', 'N2'), ('n1', 'N1'),
    ]

    title = models.CharField(max_length=200, help_text="e.g. は (wa) — Topic Marker")
    explanation = models.TextField(help_text="Detailed English explanation")
    structure = models.CharField(max_length=300, help_text="e.g. [Noun] は [Noun] です")
    jlpt_level = models.CharField(max_length=2, choices=JLPT_LEVELS, db_index=True)
    example_sentences = models.JSONField(
        default=list,
        help_text='List of {"japanese": "...", "romaji": "...", "english": "..."}'
    )
    difficulty_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['jlpt_level', 'difficulty_order']

    def __str__(self):
        return f"{self.title} — {self.jlpt_level.upper()}"
