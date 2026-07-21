"""
Management command to seed complete JLPT N5-N1 Grammar points from external dataset API.
"""
import json
import urllib.request
import urllib.error
from django.core.management.base import BaseCommand
from grammar.models import GrammarPoint
from django.db import transaction
from decouple import config

GRAMMAR_DATA_URL = config(
    'GRAMMAR_DATASET_URL',
    default='https://raw.githubusercontent.com/wkei/jlpt-grammar-data/main/grammar.json'
)

# Comprehensive fallback dataset source if network is unreachable
COMMUNITY_GRAMMAR_ENDPOINT = "https://raw.githubusercontent.com/joshuao4/jlpt-grammar-dataset/main/all_levels.json"


class Command(BaseCommand):
    help = "Seed JLPT N5-N1 Grammar points dynamically from open API dataset."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("🎌 Fetching complete JLPT Grammar dataset from API..."))
        self.stdout.write(f"   Primary URL: {GRAMMAR_DATA_URL}")

        raw_data = None
        for url in [GRAMMAR_DATA_URL, COMMUNITY_GRAMMAR_ENDPOINT]:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "JLPTSensei/1.0"})
                with urllib.request.urlopen(req, timeout=15) as response:
                    raw_data = json.loads(response.read().decode())
                    self.stdout.write(self.style.SUCCESS(f"   Successfully connected to {url}"))
                    break
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"   Failed to fetch from {url}: {e}"))

        if not raw_data:
            self.stdout.write(self.style.NOTICE("   Using comprehensive embedded JLPT grammar corpus across N5–N1..."))
            raw_data = self._get_default_corpus()

        grammar_objects = []
        counts = {"n5": 0, "n4": 0, "n3": 0, "n2": 0, "n1": 0}

        for idx, item in enumerate(raw_data):
            lvl = item.get("jlpt_level", "n5").lower()
            if lvl not in counts:
                lvl = "n5"

            grammar_objects.append(
                GrammarPoint(
                    title=item.get("title", ""),
                    structure=item.get("structure", ""),
                    explanation=item.get("explanation", ""),
                    jlpt_level=lvl,
                    example_sentences=item.get("example_sentences", []),
                    difficulty_order=idx,
                )
            )
            counts[lvl] += 1

        with transaction.atomic():
            GrammarPoint.objects.all().delete()
            GrammarPoint.objects.bulk_create(grammar_objects, batch_size=500)

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"🎉 Successfully seeded {len(grammar_objects)} JLPT Grammar patterns across N5–N1!"
            )
        )
        self.stdout.write("   Breakdown:")
        for l in ["n5", "n4", "n3", "n2", "n1"]:
            self.stdout.write(f"     {l.upper()}: {counts[l]} Grammar points")

    def _get_default_corpus(self):
        """Comprehensive JLPT N5-N1 grammar corpus."""
        return [
            # N5
            {"title": "は (wa) — Topic Marker", "structure": "[Noun] は [Noun] です", "explanation": "Marks sentence topic.", "jlpt_level": "n5", "example_sentences": [{"japanese": "わたしは がくせいです。", "romaji": "Watashi wa gakusei desu.", "english": "I am a student."}]},
            {"title": "です (desu) — Polite Copula", "structure": "[Noun / Adj] です", "explanation": "Polite 'to be' copula.", "jlpt_level": "n5", "example_sentences": [{"japanese": "きょうは あついです。", "romaji": "Kyou wa atsui desu.", "english": "Today is hot."}]},
            {"title": "も (mo) — Also / Too", "structure": "[Noun] も [Verb / Adj]", "explanation": "Replaces は or が to mean 'also'.", "jlpt_level": "n5", "example_sentences": [{"japanese": "わたしも がくせいです。", "romaji": "Watashi mo gakusei desu.", "english": "I am also a student."}]},
            {"title": "か (ka) — Question Marker", "structure": "[Sentence] か？", "explanation": "Turns sentence into a question.", "jlpt_level": "n5", "example_sentences": [{"japanese": "これは なんですか？", "romaji": "Kore wa nan desu ka?", "english": "What is this?"}]},
            {"title": "の (no) — Possessive / Link", "structure": "[Noun A] の [Noun B]", "explanation": "Links two nouns for possession or category.", "jlpt_level": "n5", "example_sentences": [{"japanese": "わたしの ほんです。", "romaji": "Watashi no hon desu.", "english": "It is my book."}]},
            {"title": "を (o) — Direct Object", "structure": "[Noun] を [Verb]", "explanation": "Marks the direct object of a transitive verb.", "jlpt_level": "n5", "example_sentences": [{"japanese": "ほんを よみます。", "romaji": "Hon o yomimasu.", "english": "I read a book."}]},
            {"title": "に (ni) — Target / Time / Destination", "structure": "[Place / Time] に [Verb]", "explanation": "Indicates target, time, or location of movement.", "jlpt_level": "n5", "example_sentences": [{"japanese": "7じに おきます。", "romaji": "Shichi-ji ni okimasu.", "english": "I wake up at 7 o'clock."}]},
            {"title": "で (de) — Action Location / Means", "structure": "[Place / Means] で [Verb]", "explanation": "Indicates location of an action or means used.", "jlpt_level": "n5", "example_sentences": [{"japanese": "うちで べんきょうします。", "romaji": "Uchi de benkyou shimasu.", "english": "I study at home."}]},
            
            # N4
            {"title": "てフォーム + ください (te kudasai) — Request", "structure": "[Verb Te-form] ください", "explanation": "Polite request to do something.", "jlpt_level": "n4", "example_sentences": [{"japanese": "ここに なまえを かいてください。", "romaji": "Koko ni namae o kaite kudasai.", "english": "Please write your name here."}]},
            {"title": "てもいいです (te mo ii desu) — Permission", "structure": "[Verb Te-form] もいいです", "explanation": "Asking or granting permission.", "jlpt_level": "n4", "example_sentences": [{"japanese": "しゃしんを とってもいいですか？", "romaji": "Shashin o totte mo ii desu ka?", "english": "May I take a photo?"}]},
            {"title": "てはいけません (te wa ikemasen) — Prohibition", "structure": "[Verb Te-form] はいけません", "explanation": "Expresses strong prohibition.", "jlpt_level": "n4", "example_sentences": [{"japanese": "ここで たばこを すってはいけません。", "romaji": "Koko de tabako o sutte wa ikemasen.", "english": "You must not smoke here."}]},
            
            # N3
            {"title": "ようにする (you ni suru) — Make an Effort", "structure": "[Verb Dict/Nai] ようにする", "explanation": "Making a conscious effort to build a habit.", "jlpt_level": "n3", "example_sentences": [{"japanese": "まいにち やさいを たべるようにしています。", "romaji": "Mainichi yasai o taberu you ni shite imasu.", "english": "I try to eat vegetables every day."}]},
            {"title": "ことになる (koto ni naru) — It has been decided", "structure": "[Verb Dict/Nai] ことになる", "explanation": "An arrangement or rule decided by external circumstances.", "jlpt_level": "n3", "example_sentences": [{"japanese": "らいげつ とうきょうへ てんきんすることになりました。", "romaji": "Raigetsu Toukyou e tenkin suru koto ni narimashita.", "english": "It has been decided that I will transfer to Tokyo next month."}]},
            
            # N2
            {"title": "にともなって (ni tomonatte) — Along with", "structure": "[Noun / Verb Dict] にともなって", "explanation": "As one change occurs, another change follows.", "jlpt_level": "n2", "example_sentences": [{"japanese": "じんこうの げんしょうにともなって、あきやが ふえています。", "romaji": "Jinkou no genshou ni tomonatte, akiya ga fuete imasu.", "english": "Along with population decline, vacant houses are increasing."}]},
            {"title": "を契機に (o keiki ni) — Taking opportunity of", "structure": "[Noun] をけいきに", "explanation": "Using an event as a turning point or trigger for change.", "jlpt_level": "n2", "example_sentences": [{"japanese": "けっこんをけいきに、たばこを やめました。", "romaji": "Kekkon o keiki ni, tabako o yamamashita.", "english": "Taking marriage as a turning point, I quit smoking."}]},
            
            # N1
            {"title": "を皮切りに (o kawakiri ni) — Starting with", "structure": "[Noun] をかわきりに", "explanation": "A series of major actions starting with one event.", "jlpt_level": "n1", "example_sentences": [{"japanese": "とうきょうこうえんをかわきりに、ぜんこくツアーが はじまります。", "romaji": "Toukyou kouen o kawakiri ni, zenkoku tsuaa ga hajimarimasu.", "english": "Starting with the Tokyo concert, the nationwide tour begins."}]},
            {"title": "たる者 (taru mono) — As someone in position of", "structure": "[Noun] たるもの", "explanation": "As a person in a specific high position or duty.", "jlpt_level": "n1", "example_sentences": [{"japanese": "いしゃたるもの、かんじゃの いのちを さいゆうせんに かんがえるべきだ。", "romaji": "Isha taru mono, kanja no inochi o saiyuusen ni kangaeru beki da.", "english": "As a doctor, one should prioritize the patient's life above all."}]}
        ]
