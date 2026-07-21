"""
Management command to seed JLPT N5-N1 Kanji data.
"""
from django.core.management.base import BaseCommand
from kanji.models import Kanji
from django.db import transaction

# Comprehensive seed dataset for Kanji across N5 - N1
KANJI_SEED_DATA = [
    # --- N5 Kanji ---
    {"character": "日", "onyomi": "ニチ, ジツ", "kunyomi": "ひ, -び, か", "meaning": "Sun, Day", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "月", "onyomi": "ゲツ, ガツ", "kunyomi": "つき", "meaning": "Moon, Month", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "火", "onyomi": "カ", "kunyomi": "ひ, -び", "meaning": "Fire", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "水", "onyomi": "スイ", "kunyomi": "みず", "meaning": "Water", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "木", "onyomi": "ボク, モク", "kunyomi": "き, こ-", "meaning": "Tree, Wood", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "金", "onyomi": "キン, コン", "kunyomi": "かね, かな-", "meaning": "Gold, Money", "stroke_count": 8, "jlpt_level": "n5"},
    {"character": "土", "onyomi": "ド, ト", "kunyomi": "つち", "meaning": "Soil, Earth", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "一", "onyomi": "イチ, イツ", "kunyomi": "ひと-, ひと.つ", "meaning": "One", "stroke_count": 1, "jlpt_level": "n5"},
    {"character": "二", "onyomi": "ニ, ジ", "kunyomi": "ふた, ふた.つ", "meaning": "Two", "stroke_count": 2, "jlpt_level": "n5"},
    {"character": "三", "onyomi": "サン", "kunyomi": "み, み.つ, みっ.つ", "meaning": "Three", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "四", "onyomi": "シ", "kunyomi": "よ, よ.つ, よっ.つ, よん", "meaning": "Four", "stroke_count": 5, "jlpt_level": "n5"},
    {"character": "五", "onyomi": "ゴ", "kunyomi": "いつ, いつ.つ", "meaning": "Five", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "六", "onyomi": "ロク", "kunyomi": "む, む.つ, むっ.つ, むい", "meaning": "Six", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "七", "onyomi": "シチ", "kunyomi": "なな, なな.つ, なの", "meaning": "Seven", "stroke_count": 2, "jlpt_level": "n5"},
    {"character": "八", "onyomi": "ハチ", "kunyomi": "や, や.つ, やっ.つ, よう", "meaning": "Eight", "stroke_count": 2, "jlpt_level": "n5"},
    {"character": "九", "onyomi": "キュウ, ク", "kunyomi": "ここの, ここの.つ", "meaning": "Nine", "stroke_count": 2, "jlpt_level": "n5"},
    {"character": "十", "onyomi": "ジュウ, ジッ", "kunyomi": "とお, と", "meaning": "Ten", "stroke_count": 2, "jlpt_level": "n5"},
    {"character": "百", "onyomi": "ヒャク", "kunyomi": "もも", "meaning": "Hundred", "stroke_count": 6, "jlpt_level": "n5"},
    {"character": "千", "onyomi": "セン", "kunyomi": "ち", "meaning": "Thousand", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "万", "onyomi": "マン, バン", "kunyomi": "よろず", "meaning": "Ten Thousand", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "円", "onyomi": "エン", "kunyomi": "まる.い", "meaning": "Yen, Circle", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "年", "onyomi": "ネン", "kunyomi": "とし", "meaning": "Year", "stroke_count": 6, "jlpt_level": "n5"},
    {"character": "上", "onyomi": "ジョウ, ショウ", "kunyomi": "うえ, あ.げる, のぼ.る", "meaning": "Above, Up", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "下", "onyomi": "カ, ゲ", "kunyomi": "した, しも, くだ.る", "meaning": "Below, Down", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "中", "onyomi": "チュウ", "kunyomi": "なか, うち", "meaning": "Middle, Inside", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "大", "onyomi": "ダイ, タイ", "kunyomi": "おお-, おお.きい", "meaning": "Big, Large", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "小", "onyomi": "ショウ", "kunyomi": "ちい.さい, こ-", "meaning": "Small", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "本", "onyomi": "ホン", "kunyomi": "もと", "meaning": "Book, Origin", "stroke_count": 5, "jlpt_level": "n5"},
    {"character": "人", "onyomi": "ジン, ニン", "kunyomi": "ひと", "meaning": "Person", "stroke_count": 2, "jlpt_level": "n5"},
    {"character": "目", "onyomi": "モク, ボク", "kunyomi": "め, -め", "meaning": "Eye", "stroke_count": 5, "jlpt_level": "n5"},
    {"character": "口", "onyomi": "コウ, ク", "kunyomi": "くち", "meaning": "Mouth", "stroke_count": 3, "jlpt_level": "n5"},
    {"character": "耳", "onyomi": "ジ", "kunyomi": "みみ", "meaning": "Ear", "stroke_count": 6, "jlpt_level": "n5"},
    {"character": "手", "onyomi": "シュ", "kunyomi": "て", "meaning": "Hand", "stroke_count": 4, "jlpt_level": "n5"},
    {"character": "足", "onyomi": "ソク", "kunyomi": "あし, た.りる", "meaning": "Foot, Leg", "stroke_count": 7, "jlpt_level": "n5"},
    {"character": "力", "onyomi": "リョク, リキ", "kunyomi": "ちから", "meaning": "Power, Strength", "stroke_count": 2, "jlpt_level": "n5"},

    # --- N4 Kanji ---
    {"character": "会", "onyomi": "カイ, エ", "kunyomi": "あ.う", "meaning": "Meeting, Meet", "stroke_count": 6, "jlpt_level": "n4"},
    {"character": "同", "onyomi": "ドウ", "kunyomi": "おな.じ", "meaning": "Same", "stroke_count": 6, "jlpt_level": "n4"},
    {"character": "事", "onyomi": "ジ, ズ", "kunyomi": "こと, つか.える", "meaning": "Thing, Matter", "stroke_count": 8, "jlpt_level": "n4"},
    {"character": "自", "onyomi": "ジ, シ", "kunyomi": "みずか.ら", "meaning": "Self", "stroke_count": 6, "jlpt_level": "n4"},
    {"character": "社", "onyomi": "シャ", "kunyomi": "やしろ", "meaning": "Company, Shrine", "stroke_count": 7, "jlpt_level": "n4"},
    {"character": "発", "onyomi": "ハツ, ホツ", "kunyomi": "た.つ, あば.く", "meaning": "Departure, Emit", "stroke_count": 9, "jlpt_level": "n4"},
    {"character": "者", "onyomi": "シャ", "kunyomi": "もの", "meaning": "Person", "stroke_count": 8, "jlpt_level": "n4"},
    {"character": "地", "onyomi": "チ, ジ", "kunyomi": "つち", "meaning": "Earth, Ground", "stroke_count": 6, "jlpt_level": "n4"},
    {"character": "業", "onyomi": "ギョウ, ゴウ", "kunyomi": "わざ", "meaning": "Business, Industry", "stroke_count": 13, "jlpt_level": "n4"},
    {"character": "方", "onyomi": "ホウ", "kunyomi": "かた, -がた", "meaning": "Direction, Person", "stroke_count": 4, "jlpt_level": "n4"},

    # --- N3 Kanji ---
    {"character": "政", "onyomi": "セイ, ショウ", "kunyomi": "まつりごと", "meaning": "Politics, Government", "stroke_count": 9, "jlpt_level": "n3"},
    {"character": "経", "onyomi": "ケイ, キョウ", "kunyomi": "へ.る, たていと", "meaning": "Pass Through, Manage", "stroke_count": 11, "jlpt_level": "n3"},
    {"character": "済", "onyomi": "サイ, ザイ", "kunyomi": "す.む, す.ます", "meaning": "Settle, Finish", "stroke_count": 11, "jlpt_level": "n3"},
    {"character": "簡", "onyomi": "カン", "kunyomi": "えら.ぶ", "meaning": "Simple, Brevity", "stroke_count": 18, "jlpt_level": "n3"},
    {"character": "単", "onyomi": "タン", "kunyomi": "ひととつ", "meaning": "Simple, Single", "stroke_count": 9, "jlpt_level": "n3"},

    # --- N2 Kanji ---
    {"character": "党", "onyomi": "トウ", "kunyomi": "なかま", "meaning": "Political Party, Faction", "stroke_count": 10, "jlpt_level": "n2"},
    {"character": "協", "onyomi": "キョウ", "kunyomi": "かな.う", "meaning": "Cooperation", "stroke_count": 8, "jlpt_level": "n2"},
    {"character": "総", "onyomi": "ソウ", "kunyomi": "すべ.て, ふさ", "meaning": "General, Overall", "stroke_count": 14, "jlpt_level": "n2"},

    # --- N1 Kanji ---
    {"character": "欄", "onyomi": "ラン", "kunyomi": "てすり", "meaning": "Column, Railing", "stroke_count": 20, "jlpt_level": "n1"},
    {"character": "微", "onyomi": "ビ", "kunyomi": "かす.か", "meaning": "Delicate, Minute", "stroke_count": 13, "jlpt_level": "n1"},
    {"character": "繊", "onyomi": "セン", "kunyomi": "ほそ.い", "meaning": "Slender, Fine", "stroke_count": 17, "jlpt_level": "n1"},
]


class Command(BaseCommand):
    help = "Seed JLPT N5-N1 Kanji characters."

    def handle(self, *args, **options):
        self.stdout.write("🎌 Seeding Kanji dataset...")
        
        kanji_objects = []
        for idx, item in enumerate(KANJI_SEED_DATA):
            kanji_objects.append(
                Kanji(
                    character=item["character"],
                    onyomi=item["onyomi"],
                    kunyomi=item["kunyomi"],
                    meaning=item["meaning"],
                    stroke_count=item["stroke_count"],
                    jlpt_level=item["jlpt_level"],
                    difficulty_order=idx,
                )
            )

        with transaction.atomic():
            Kanji.objects.all().delete()
            Kanji.objects.bulk_create(kanji_objects)

        self.stdout.write(self.style.SUCCESS(f"🎉 Successfully seeded {len(kanji_objects)} Kanji characters across N5–N1!"))
