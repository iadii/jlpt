from django.contrib import admin
from .models import GrammarPoint

@admin.register(GrammarPoint)
class GrammarPointAdmin(admin.ModelAdmin):
    list_display = ['title', 'jlpt_level', 'structure', 'difficulty_order']
    list_filter = ['jlpt_level']
    search_fields = ['title', 'explanation']
