"""
Management command to seed JLPT N5-N1 vocabulary from the jlpt-vocab-api.

Data source: https://jlpt-vocab-api.vercel.app
Contains real English meanings, furigana, romaji for all 5 JLPT levels.
"""
import json
import urllib.request
import urllib.error
from decouple import config
from django.core.management.base import BaseCommand
from vocabulary.models import Vocabulary
from django.db import transaction


# API returns words with: word, meaning, furigana, romaji, level
API_BASE = config('JLPT_VOCAB_API_URL', default='https://jlpt-vocab-api.vercel.app/api/words')

# Map JLPT levels (API uses 1-5, we use n1-n5)
LEVELS = [5, 4, 3, 2, 1]

# Heuristics to guess part of speech from the word itself
def guess_pos(word: str, meaning: str) -> str:
    """
    Best-effort part-of-speech classification from the English meaning.
    Not perfect, but far better than hardcoding 'noun' for everything.
    """
    meaning_lower = meaning.lower()

    # Check for verb indicators
    if meaning_lower.startswith("to "):
        return "verb"

    # Check for adjective indicators (-い adjectives and -な adjectives)
    if word.endswith("い") and not word.endswith("しい"):
        # Could be i-adjective or verb — check meaning
        if any(kw in meaning_lower for kw in ["is ", "be ", "-"]):
            return "i-adjective"
    if word.endswith("しい"):
        return "i-adjective"
    if any(kw in meaning_lower for kw in ["~na", "(na)", "na-adj"]):
        return "na-adjective"

    # Check for adverb indicators
    adverb_endings = ["に", "く", "と"]
    if any(word.endswith(e) for e in adverb_endings):
        if any(kw in meaning_lower for kw in ["ly", "very", "always", "often", "already", "still"]):
            return "adverb"

    # Check for counter
    if meaning_lower.startswith("counter"):
        return "counter"

    # Check for expression
    if any(kw in meaning_lower for kw in ["please", "excuse", "hello", "goodbye", "thank"]):
        return "expression"

    # Check for particle
    if len(word) <= 2 and any(kw in meaning_lower for kw in ["particle", "subject", "object", "topic"]):
        return "particle"

    # Check for pronoun
    pronouns = ["i", "you", "he", "she", "we", "they", "this", "that", "what", "who"]
    if meaning_lower.strip() in pronouns or meaning_lower.startswith("that ") and len(word) <= 3:
        return "pronoun"

    # Check for conjunction
    if any(kw in meaning_lower for kw in ["but", "however", "therefore", "and then", "because"]):
        if len(word) <= 5:
            return "conjunction"

    # Default to noun
    return "noun"


class Command(BaseCommand):
    help = "Seed JLPT N5-N1 vocabulary from the jlpt-vocab-api with real English meanings."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            default=True,
            help="Clear existing vocabulary before seeding (default: True)",
        )
        parser.add_argument(
            "--levels",
            nargs="+",
            type=int,
            default=LEVELS,
            help="Which JLPT levels to seed (e.g. --levels 5 4 3)",
        )

    def handle(self, *args, **options):
        levels_to_seed = options["levels"]
        clear = options["clear"]

        self.stdout.write(self.style.NOTICE("🎌 JLPT Vocabulary Seeder"))
        self.stdout.write(f"   Levels: {', '.join(f'N{l}' for l in levels_to_seed)}")
        self.stdout.write(f"   Source: {API_BASE}")
        self.stdout.write("")

        all_vocab = []

        for level_num in levels_to_seed:
            words = self._fetch_level(level_num)
            if words is None:
                continue

            jlpt_level = f"n{level_num}"
            level_vocab = []

            for idx, word_data in enumerate(words):
                raw_word = word_data.get("word", "")
                furigana = word_data.get("furigana", "")
                meaning = word_data.get("meaning", "")
                romaji = word_data.get("romaji", "")

                # Determine kanji vs kana-only
                # If word == furigana, it's kana-only (no kanji)
                kanji = raw_word if raw_word != furigana else ""

                pos = guess_pos(raw_word, meaning)

                level_vocab.append(
                    Vocabulary(
                        kanji=kanji,
                        kana=furigana or raw_word,
                        romaji=romaji,
                        meaning=meaning,
                        jlpt_level=jlpt_level,
                        part_of_speech=pos,
                        category="general",
                        difficulty_order=idx,
                    )
                )

            all_vocab.extend(level_vocab)
            self.stdout.write(
                self.style.SUCCESS(f"   ✅ N{level_num}: {len(level_vocab)} words fetched")
            )

        if not all_vocab:
            self.stdout.write(self.style.ERROR("No data fetched. Aborting."))
            return

        # Write to database
        with transaction.atomic():
            if clear:
                deleted_count = Vocabulary.objects.all().delete()[0]
                self.stdout.write(f"\n   🗑️  Cleared {deleted_count} existing records")

            Vocabulary.objects.bulk_create(all_vocab, batch_size=500)

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"🎉 Successfully seeded {len(all_vocab)} vocabulary words across "
                f"{len(levels_to_seed)} JLPT levels!"
            )
        )

        # Print summary
        self.stdout.write("")
        self.stdout.write("   Level breakdown:")
        for level_num in levels_to_seed:
            count = Vocabulary.objects.filter(jlpt_level=f"n{level_num}").count()
            self.stdout.write(f"     N{level_num}: {count} words")

    def _fetch_level(self, level_num: int):
        """Fetch all words for a given JLPT level from the API."""
        self.stdout.write(f"   📡 Fetching N{level_num}...")

        all_words = []
        offset = 0
        batch_size = 2000

        while True:
            url = f"{API_BASE}?level={level_num}&offset={offset}&limit={batch_size}"
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "JLPTSensei/1.0"})
                with urllib.request.urlopen(req, timeout=30) as response:
                    data = json.loads(response.read().decode())
            except (urllib.error.URLError, json.JSONDecodeError) as e:
                self.stdout.write(
                    self.style.ERROR(f"   ❌ Failed to fetch N{level_num} at offset {offset}: {e}")
                )
                return None

            words = data.get("words", [])
            total = data.get("total", 0)
            all_words.extend(words)

            if len(all_words) >= total or not words:
                break
            offset += batch_size

        return all_words
