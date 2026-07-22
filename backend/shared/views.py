from django.http import JsonResponse, StreamingHttpResponse
import edge_tts

async def tts_view(request):
    """
    Asynchronously streams TTS audio back to the client using edge-tts.
    Requires 'text' as a query parameter.
    """
    text = request.GET.get('text')
    if not text:
        return JsonResponse({'error': 'text parameter is required'}, status=400)
    
    # Use Microsoft Azure's Neural female voice for high quality non-robotic Japanese TTS
    voice = 'ja-JP-NanamiNeural'
    
    communicate = edge_tts.Communicate(text, voice)
    
    async def audio_stream():
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]

    response = StreamingHttpResponse(audio_stream(), content_type='audio/mpeg')
    response['Cache-Control'] = 'public, max-age=31536000' # Cache for a year
    return response
