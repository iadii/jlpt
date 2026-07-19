"""
Kana — Mappers.
"""


class KanaMapper:

    @staticmethod
    def to_list_dto(kana):
        return {
            'id': kana.id,
            'character': kana.character,
            'romaji': kana.romaji,
            'kana_type': kana.kana_type,
            'group': kana.group,
            'order': kana.order,
        }

    @staticmethod
    def to_detail_dto(kana):
        return {
            'id': kana.id,
            'character': kana.character,
            'romaji': kana.romaji,
            'kana_type': kana.kana_type,
            'group': kana.group,
            'stroke_order_image': kana.stroke_order_image.url if kana.stroke_order_image else None,
            'audio_url': kana.audio_url.url if kana.audio_url else None,
            'order': kana.order,
        }

    @staticmethod
    def to_list(queryset):
        return [KanaMapper.to_list_dto(k) for k in queryset]
