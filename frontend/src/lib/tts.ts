import { API_BASE_URL } from './api';

let currentAudio: HTMLAudioElement | null = null;

export const speakJapanese = (text: string, rate = 1.0) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  
  const url = `${API_BASE_URL}/shared/tts/?text=${encodeURIComponent(text)}`;
  
  currentAudio = new Audio(url);
  currentAudio.playbackRate = rate; 
  
  currentAudio.play().catch((err) => {
    console.error('Failed to play backend TTS audio:', err);
  });
};
