"""
Management command to seed complete JLPT N5-N1 Kanji from the open kanji-data dataset.
Source: https://github.com/davidluzgouveia/kanji-data
"""
import json
import urllib.request
import urllib.error
from django.core.management.base import BaseCommand
from kanji.models import Kanji
from django.db import transaction
from decouple import config

KANJI_DATA_URL = config(
    'KANJI_DATASET_URL',
    default='https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json'
)


class Command(BaseCommand):
    help = "Seed complete JLPT N5-N1 Kanji from open-source dataset."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("🎌 Fetching complete JLPT Kanji dataset..."))
        self.stdout.write(f"   Source: {KANJI_DATA_URL}")

        try:
            req = urllib.request.Request(KANJI_DATA_URL, headers={"User-Agent": "JLPTSensei/1.0"})
            with urllib.request.urlopen(req, timeout=30) as response:
                raw_data = json.loads(response.read().decode())
        except (urllib.error.URLError, json.JSONDecodeError) as e:
            self.stdout.write(self.style.ERROR(f"❌ Failed to fetch Kanji dataset: {e}"))
            return

        self.stdout.write(self.style.SUCCESS(f"   Fetched {len(raw_data)} total Kanji entries. Processing JLPT N5–N1..."))

        kanji_objects = []
        counts = {"n5": 0, "n4": 0, "n3": 0, "n2": 0, "n1": 0}

        for idx, (character, info) in enumerate(raw_data.items()):
            # Level check
            jlpt_num = info.get("jlpt_new") or info.get("jlpt")
            if not jlpt_num or jlpt_num not in [1, 2, 3, 4, 5]:
                continue

            jlpt_level = f"n{jlpt_num}"
            meanings_list = info.get("meanings", [])
            meaning_str = ", ".join(meanings_list[:3]) if meanings_list else "Meaning N/A"

            onyomi_list = info.get("readings_on", [])
            kunyomi_list = info.get("readings_kun", [])

            kanji_objects.append(
                Kanji(
                    character=character,
                    onyomi=", ".join(onyomi_list),
                    kunyomi=", ".join(kunyomi_list),
                    meaning=meaning_str,
                    stroke_count=info.get("strokes", 1),
                    jlpt_level=jlpt_level,
                    difficulty_order=idx,
                )
            )
            counts[jlpt_level] += 1

        if not kanji_objects:
            self.stdout.write(self.style.ERROR("No valid JLPT Kanji parsed."))
            return

        with transaction.atomic():
            Kanji.objects.all().delete()
            Kanji.objects.bulk_create(kanji_objects, batch_size=500)

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"🎉 Successfully seeded {len(kanji_objects)} JLPT Kanji across N5–N1!"
            )
        )
        self.stdout.write("   Breakdown:")
        for lvl in ["n5", "n4", "n3", "n2", "n1"]:
            self.stdout.write(f"     {lvl.upper()}: {counts[lvl]} Kanji")
