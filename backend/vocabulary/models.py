from django.db import models


class Vocabulary(models.Model):
    """Japanese vocabulary words organized by JLPT level."""

    JLPT_LEVELS = [
        ('n5', 'N5'), ('n4', 'N4'), ('n3', 'N3'), ('n2', 'N2'), ('n1', 'N1'),
    ]

    PART_OF_SPEECH_CHOICES = [
        ('noun', 'Noun'),
        ('verb', 'Verb'),
        ('i-adjective', 'い-Adjective'),
        ('na-adjective', 'な-Adjective'),
        ('adverb', 'Adverb'),
        ('particle', 'Particle'),
        ('counter', 'Counter'),
        ('expression', 'Expression'),
        ('pronoun', 'Pronoun'),
        ('conjunction', 'Conjunction'),
        ('prefix', 'Prefix'),
        ('suffix', 'Suffix'),
    ]

    CATEGORY_CHOICES = [
        ('greetings', 'Greetings'),
        ('food', 'Food & Drink'),
        ('numbers', 'Numbers & Counting'),
        ('travel', 'Travel & Directions'),
        ('family', 'Family & People'),
        ('time', 'Time & Date'),
        ('weather', 'Weather & Nature'),
        ('body', 'Body & Health'),
        ('school', 'School & Education'),
        ('work', 'Work & Business'),
        ('shopping', 'Shopping & Money'),
        ('hobbies', 'Hobbies & Sports'),
        ('house', 'House & Daily Life'),
        ('general', 'General'),
    ]

    kanji = models.CharField(max_length=100, blank=True, null=True)
    kana = models.CharField(max_length=100)
    romaji = models.CharField(max_length=100)
    meaning = models.CharField(max_length=255)
    jlpt_level = models.CharField(max_length=2, choices=JLPT_LEVELS, db_index=True)
    part_of_speech = models.CharField(max_length=20, choices=PART_OF_SPEECH_CHOICES, default='noun')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general', db_index=True)
    example_sentence_jp = models.TextField(blank=True, default='')
    example_sentence_en = models.TextField(blank=True, default='')
    audio_url = models.FileField(upload_to='vocabulary/audio/', blank=True, null=True)
    difficulty_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['jlpt_level', 'difficulty_order']
        verbose_name_plural = 'Vocabulary'

    def __str__(self):
        display = self.kanji if self.kanji else self.kana
        return f"{display} ({self.meaning}) — {self.jlpt_level.upper()}"
