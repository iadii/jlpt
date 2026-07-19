from django.contrib import admin
from .models import Kana

@admin.register(Kana)
class KanaAdmin(admin.ModelAdmin):
    list_display = ['character', 'romaji', 'kana_type', 'group', 'order']
    list_filter = ['kana_type', 'group']
    search_fields = ['character', 'romaji']
    ordering = ['kana_type', 'order']
