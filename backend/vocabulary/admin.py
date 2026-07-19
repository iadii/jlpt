from django.contrib import admin
from .models import Vocabulary

@admin.register(Vocabulary)
class VocabularyAdmin(admin.ModelAdmin):
    list_display = ['kanji', 'kana', 'meaning', 'jlpt_level', 'part_of_speech', 'category']
    list_filter = ['jlpt_level', 'part_of_speech', 'category']
    search_fields = ['kanji', 'kana', 'romaji', 'meaning']
    ordering = ['jlpt_level', 'difficulty_order']
