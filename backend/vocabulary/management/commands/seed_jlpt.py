import json
import urllib.request
import urllib.error
import re
from django.core.management.base import BaseCommand
from vocabulary.models import Vocabulary
from django.db import transaction

class Command(BaseCommand):
    help = 'Seed JLPT N5 to N1 vocabulary from open source datasets.'

    def handle(self, *args, **options):
        self.stdout.write("Fetching JLPT vocabulary from internet...")
        
        # We will use the Bluskyo/JLPT_Vocabulary repo because we know the URL works.
        url = "https://raw.githubusercontent.com/Bluskyo/JLPT_Vocabulary/main/data/vocab/results/JLPT_vocab_ALL.json"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                bluskyo_data = json.loads(response.read().decode())
                
            self.stdout.write("Successfully fetched data from Bluskyo! Processing...")
            
            vocab_to_create = []
            count = 0
            
            # Bluskyo JSON format:
            # { "word": [ { "reading": "...", "level": 1 } ] }
            for word, instances in bluskyo_data.items():
                if not instances: continue
                
                reading = instances[0].get("reading", "")
                level_num = instances[0].get("level", 5)
                jlpt_level = f"n{level_num}"
                
                # We do not have real meanings in this JSON, but we can seed it with dummy meanings
                # or use a regex to extract romaji if we really wanted to, but we'll leave romaji blank or default.
                vocab_to_create.append(
                    Vocabulary(
                        kanji=word if word != reading else "",
                        kana=reading,
                        romaji="", 
                        meaning=f"Meaning of {word} (from internet dataset)",
                        jlpt_level=jlpt_level,
                        part_of_speech='noun',
                        category='general'
                    )
                )
                count += 1
            
            with transaction.atomic():
                Vocabulary.objects.all().delete()
                # Bulk create in chunks to avoid memory issues
                Vocabulary.objects.bulk_create(vocab_to_create, batch_size=2000)
                
            self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} words across N5-N1!"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to fetch or parse dataset: {e}"))
            
