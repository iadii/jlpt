import json
import uuid
from django.core.management.base import BaseCommand
from kana.models import Kana
from vocabulary.models import Vocabulary
from kanji.models import Kanji
from grammar.models import GrammarPoint

class Command(BaseCommand):
    help = 'Seeds the database with initial Japanese learning content'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # 1. Seed Hiragana (Subset)
        hiragana_data = [
            {'character': 'あ', 'romaji': 'a', 'group': 'a-row', 'order': 1},
            {'character': 'い', 'romaji': 'i', 'group': 'a-row', 'order': 2},
            {'character': 'う', 'romaji': 'u', 'group': 'a-row', 'order': 3},
            {'character': 'え', 'romaji': 'e', 'group': 'a-row', 'order': 4},
            {'character': 'お', 'romaji': 'o', 'group': 'a-row', 'order': 5},
            {'character': 'か', 'romaji': 'ka', 'group': 'ka-row', 'order': 6},
            {'character': 'き', 'romaji': 'ki', 'group': 'ka-row', 'order': 7},
            {'character': 'く', 'romaji': 'ku', 'group': 'ka-row', 'order': 8},
            {'character': 'け', 'romaji': 'ke', 'group': 'ka-row', 'order': 9},
            {'character': 'こ', 'romaji': 'ko', 'group': 'ka-row', 'order': 10},
        ]

        for k in hiragana_data:
            Kana.objects.get_or_create(
                character=k['character'],
                kana_type='hiragana',
                defaults={
                    'romaji': k['romaji'],
                    'group': k['group'],
                    'order': k['order']
                }
            )
        self.stdout.write(self.style.SUCCESS("✓ Seeded Hiragana"))

        # 2. Seed N5 Vocabulary
        vocab_data = [
            {
                'kanji': '食べる', 'kana': 'たべる', 'romaji': 'taberu',
                'meaning': 'to eat', 'jlpt_level': 'n5', 'part_of_speech': 'verb',
                'category': 'food', 'difficulty_order': 1,
                'example_sentence_jp': '朝ごはんを食べる。',
                'example_sentence_en': 'I eat breakfast.'
            },
            {
                'kanji': '水', 'kana': 'みず', 'romaji': 'mizu',
                'meaning': 'water', 'jlpt_level': 'n5', 'part_of_speech': 'noun',
                'category': 'food', 'difficulty_order': 2,
                'example_sentence_jp': '水を飲む。',
                'example_sentence_en': 'I drink water.'
            },
            {
                'kanji': '行く', 'kana': 'いく', 'romaji': 'iku',
                'meaning': 'to go', 'jlpt_level': 'n5', 'part_of_speech': 'verb',
                'category': 'movement', 'difficulty_order': 3,
                'example_sentence_jp': '学校へ行く。',
                'example_sentence_en': 'I go to school.'
            },
            {
                'kanji': '大きい', 'kana': 'おおきい', 'romaji': 'ookii',
                'meaning': 'big', 'jlpt_level': 'n5', 'part_of_speech': 'adjective',
                'category': 'description', 'difficulty_order': 4,
                'example_sentence_jp': '大きい犬です。',
                'example_sentence_en': 'It is a big dog.'
            }
        ]

        for v in vocab_data:
            Vocabulary.objects.get_or_create(
                kana=v['kana'],
                defaults=v
            )
        self.stdout.write(self.style.SUCCESS("✓ Seeded Vocabulary"))

        # 3. Seed N5 Kanji
        kanji_data = [
            {
                'character': '食', 'onyomi': 'ショク', 'kunyomi': 'た.べる',
                'meaning': 'eat, food', 'stroke_count': 9, 'jlpt_level': 'n5',
                'difficulty_order': 1
            },
            {
                'character': '水', 'onyomi': 'スイ', 'kunyomi': 'みず',
                'meaning': 'water', 'stroke_count': 4, 'jlpt_level': 'n5',
                'difficulty_order': 2
            }
        ]

        for kj in kanji_data:
            obj, created = Kanji.objects.get_or_create(
                character=kj['character'],
                defaults={
                    'onyomi': kj['onyomi'],
                    'kunyomi': kj['kunyomi'],
                    'meaning': kj['meaning'],
                    'stroke_count': kj['stroke_count'],
                    'jlpt_level': kj['jlpt_level'],
                    'difficulty_order': kj['difficulty_order']
                }
            )
            # Link example words if created
            if created and kj['character'] == '食':
                v = Vocabulary.objects.filter(kanji='食べる').first()
                if v: obj.example_words.add(v)
            if created and kj['character'] == '水':
                v = Vocabulary.objects.filter(kanji='水').first()
                if v: obj.example_words.add(v)

        self.stdout.write(self.style.SUCCESS("✓ Seeded Kanji"))

        # 4. Seed N5 Grammar
        grammar_data = [
            {
                'title': 'は (wa) - Topic Marker',
                'structure': '[Noun] は [Noun] です',
                'explanation': 'Indicates the topic of the sentence.',
                'jlpt_level': 'n5',
                'difficulty_order': 1,
                'example_sentences': [
                    {'jp': '私は学生です。', 'en': 'I am a student.', 'romaji': 'watashi wa gakusei desu.'}
                ]
            },
            {
                'title': 'を (wo) - Object Marker',
                'structure': '[Noun] を [Verb]',
                'explanation': 'Indicates the direct object of an action.',
                'jlpt_level': 'n5',
                'difficulty_order': 2,
                'example_sentences': [
                    {'jp': 'りんごを食べる。', 'en': 'I eat an apple.', 'romaji': 'ringo wo taberu.'}
                ]
            }
        ]

        for g in grammar_data:
            GrammarPoint.objects.get_or_create(
                title=g['title'],
                defaults=g
            )
        self.stdout.write(self.style.SUCCESS("✓ Seeded Grammar"))
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
