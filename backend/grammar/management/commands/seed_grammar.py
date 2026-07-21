"""
Management command to seed JLPT N5-N1 Grammar points.
"""
from django.core.management.base import BaseCommand
from grammar.models import GrammarPoint
from django.db import transaction

GRAMMAR_SEED_DATA = [
    # --- N5 Grammar Points ---
    {
        "title": "は (wa) — Topic Marker",
        "structure": "[Noun] は [Noun] です",
        "explanation": "The particle は (pronounced 'wa') marks the topic of a sentence. It introduces what you are going to talk about.",
        "jlpt_level": "n5",
        "example_sentences": [
            {"japanese": "わたしは がくせいです。", "romaji": "Watashi wa gakusei desu.", "english": "I am a student."},
            {"japanese": "これは ほんです。", "romaji": "Kore wa hon desu.", "english": "This is a book."}
        ]
    },
    {
        "title": "です (desu) — To Be (Polite)",
        "structure": "[Noun / Adj] です",
        "explanation": "です (desu) is the polite copula in Japanese, equivalent to 'is', 'am', or 'are' in English.",
        "jlpt_level": "n5",
        "example_sentences": [
            {"japanese": "きょうは あついです。", "romaji": "Kyou wa atsui desu.", "english": "Today is hot."},
            {"japanese": "たなかさんは せんせいです。", "romaji": "Tanaka-san wa sensei desu.", "english": "Mr. Tanaka is a teacher."}
        ]
    },
    {
        "title": "も (mo) — Also / Too",
        "structure": "[Noun] も [Verb / Adj]",
        "explanation": "The particle も (mo) replaces は or が to mean 'also' or 'too'.",
        "jlpt_level": "n5",
        "example_sentences": [
            {"japanese": "わたしも がくせいです。", "romaji": "Watashi mo gakusei desu.", "english": "I am also a student."},
            {"japanese": "これも おいしいです。", "romaji": "Kore mo oishii desu.", "english": "This is also delicious."}
        ]
    },
    {
        "title": "か (ka) — Question Particle",
        "structure": "[Sentence] か？",
        "explanation": "Adding か (ka) at the end of a polite sentence turns it into a question. No question mark is strictly required in traditional Japanese.",
        "jlpt_level": "n5",
        "example_sentences": [
            {"japanese": "あなたも がくせいですか？", "romaji": "Anata mo gakusei desu ka?", "english": "Are you a student too?"},
            {"japanese": "これは なんですか？", "romaji": "Kore wa nan desu ka?", "english": "What is this?"}
        ]
    },
    {
        "title": "の (no) — Possessive / Association Particle",
        "structure": "[Noun A] の [Noun B]",
        "explanation": "The particle の (no) links two nouns, indicating possession (like 's in English) or category association.",
        "jlpt_level": "n5",
        "example_sentences": [
            {"japanese": "わたしの ほんです。", "romaji": "Watashi no hon desu.", "english": "It is my book."},
            {"japanese": "にほんごの せんせいです。", "romaji": "Nihongo no sensei desu.", "english": "He is a Japanese teacher."}
        ]
    },
    {
        "title": "を (o) — Direct Object Marker",
        "structure": "[Noun] を [Verb]",
        "explanation": "The particle を (pronounced 'o') marks the direct object that receives the action of a transitive verb.",
        "jlpt_level": "n5",
        "example_sentences": [
            {"japanese": "みずを のみます。", "romaji": "Mizu o nomimasu.", "english": "I drink water."},
            {"japanese": "ほんを よみます。", "romaji": "Hon o yomimasu.", "english": "I read a book."}
        ]
    },

    # --- N4 Grammar Points ---
    {
        "title": "てフォーム + くだい (te kudasai) — Please do...",
        "structure": "[Verb Te-form] ください",
        "explanation": "Used to make a polite request asking someone to perform an action.",
        "jlpt_level": "n4",
        "example_sentences": [
            {"japanese": "ここに なまえを かいてください。", "romaji": "Koko ni namae o kaite kudasai.", "english": "Please write your name here."},
            {"japanese": "ちょっと まってください。", "romaji": "Chotto matte kudasai.", "english": "Please wait a moment."}
        ]
    },
    {
        "title": "てもいいです (te mo ii desu) — May / Permission",
        "structure": "[Verb Te-form] もいいです",
        "explanation": "Used to grant or ask for permission to do something.",
        "jlpt_level": "n4",
        "example_sentences": [
            {"japanese": "しゃしんを とってもいいですか？", "romaji": "Shashin o totte mo ii desu ka?", "english": "May I take a photo?"},
            {"japanese": "はい、いいですよ。", "romaji": "Hai, ii desu yo.", "english": "Yes, you may."}
        ]
    },

    # --- N3 Grammar Points ---
    {
        "title": "ようにする (you ni suru) — Make an effort to...",
        "structure": "[Verb Dictionary / Nai form] ようにする",
        "explanation": "Indicates a conscious effort or habit building to make sure something happens or doesn't happen.",
        "jlpt_level": "n3",
        "example_sentences": [
            {"japanese": "まいにち やさいを たべるようにしています。", "romaji": "Mainichi yasai o taberu you ni shite imasu.", "english": "I try to eat vegetables every day."}
        ]
    },

    # --- N2 Grammar Points ---
    {
        "title": "にともなって (ni tomonatte) — Along with / As...",
        "structure": "[Noun / Verb Dict] にともなって",
        "explanation": "Indicates that as one change happens, another change occurs simultaneously as a result.",
        "jlpt_level": "n2",
        "example_sentences": [
            {"japanese": "じんこうの げんしょうにともなって、くうきやが ふえています。", "romaji": "Jinkou no genshou ni tomonatte, kuukiya ga fuete imasu.", "english": "Along with population decline, vacant houses are increasing."}
        ]
    },

    # --- N1 Grammar Points ---
    {
        "title": "をかわきりに (o kawakiri ni) — Starting with...",
        "structure": "[Noun] をかわきりに",
        "explanation": "Expresses that a series of events or actions begins with a specific major event.",
        "jlpt_level": "n1",
        "example_sentences": [
            {"japanese": "とうきょうこうえんをかわきりに、ぜんこくツアーが はじまります。", "romaji": "Toukyou kouen o kawakiri ni, zenkoku tsuaa ga hajimarimasu.", "english": "Starting with the Tokyo concert, the nationwide tour will begin."}
        ]
    },
]


class Command(BaseCommand):
    help = "Seed JLPT N5-N1 Grammar points."

    def handle(self, *args, **options):
        self.stdout.write("🎌 Seeding Grammar dataset...")
        
        grammar_objects = []
        for idx, item in enumerate(GRAMMAR_SEED_DATA):
            grammar_objects.append(
                GrammarPoint(
                    title=item["title"],
                    structure=item["structure"],
                    explanation=item["explanation"],
                    jlpt_level=item["jlpt_level"],
                    example_sentences=item["example_sentences"],
                    difficulty_order=idx,
                )
            )

        with transaction.atomic():
            GrammarPoint.objects.all().delete()
            GrammarPoint.objects.bulk_create(grammar_objects)

        self.stdout.write(self.style.SUCCESS(f"🎉 Successfully seeded {len(grammar_objects)} Grammar points across N5–N1!"))
