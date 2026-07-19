from django.contrib import admin
from .models import Kanji

@admin.register(Kanji)
class KanjiAdmin(admin.ModelAdmin):
    list_display = ['character', 'meaning', 'onyomi', 'kunyomi', 'jlpt_level', 'stroke_count']
    list_filter = ['jlpt_level']
    search_fields = ['character', 'meaning', 'onyomi', 'kunyomi']
    filter_horizontal = ['example_words']
