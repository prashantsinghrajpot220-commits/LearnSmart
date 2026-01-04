import { TranscriptionResult } from '@/types/notes';

// For production, you would use:
// - expo-speech (basic, free)
// - Google Cloud Speech-to-Text API
// - OpenAI Whisper API
// - Azure Speech Services

export class SpeechToTextService {
  private static instance: SpeechToTextService;
  private recognition: any = null;
  private isListening: boolean = false;

  private constructor() {}

  public static getInstance(): SpeechToTextService {
    if (!SpeechToTextService.instance) {
      SpeechToTextService.instance = new SpeechToTextService();
    }
    return SpeechToTextService.instance;
  }

  isSupported(): boolean {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      return true;
    }
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      return true;
    }
    return false;
  }

  async startListening(
    onResult: (result: TranscriptionResult) => void,
    onError: (error: string) => void,
    language: 'en' | 'hi' | 'hinglish' = 'en'
  ): Promise<void> {
    if (!this.isSupported()) {
      onError('Speech recognition is not supported on this device');
      return;
    }

    if (this.isListening) {
      await this.stopListening();
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getLanguageCode(language);
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        onResult({
          text: finalTranscript || interimTranscript,
          confidence: finalTranscript ? 1 : 0.7, // Lower confidence for interim results
          language,
          timestamp: Date.now(),
        });
      };

      this.recognition.onerror = (event: any) => {
        const errorMessage = this.getErrorMessage(event.error);
        onError(errorMessage);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError('Failed to start speech recognition');
      this.isListening = false;
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
                    // Error handled silently
      }
      this.isListening = false;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  async transcribeFromAudio(
    audioData: string | Blob,
    language: 'en' | 'hi' | 'hinglish' = 'en'
  ): Promise<TranscriptionResult> {
    // This would be implemented with a real speech-to-text API
    // For now, return a placeholder result
    
    // In production, you would:
    // 1. Send audio data to Whisper API, Google Cloud Speech, or similar
    // 2. Receive transcription
    // 3. Return the result
    
    return {
      text: 'Speech-to-text transcription would happen here using an external API like Google Cloud Speech-to-Text or Whisper API.',
      confidence: 0.85,
      language,
      timestamp: Date.now(),
    };
  }

  private getLanguageCode(language: 'en' | 'hi' | 'hinglish'): string {
    switch (language) {
      case 'en':
        return 'en-US';
      case 'hi':
        return 'hi-IN';
      case 'hinglish':
        return 'en-IN'; // Best approximation for Hinglish
      default:
        return 'en-US';
    }
  }

  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'Microphone not found or permission denied.',
      'not-allowed': 'Microphone permission was denied.',
      'network': 'Network error occurred. Please check your connection.',
      'aborted': 'Speech recognition was aborted.',
    };

    return errorMessages[error] || 'An error occurred during speech recognition.';
  }

  async requestPermissions(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      // Check if we can access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately - we just wanted to check permissions
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
                  // Error handled silently
      return false;
    }
  }

  // Fallback for when speech recognition is not available
  getFallbackTranscription(): TranscriptionResult {
    return {
      text: '',
      confidence: 0,
      language: 'en',
      timestamp: Date.now(),
    };
  }
}

export const speechToTextService = SpeechToTextService.getInstance();

// Utility function to detect language from text
export function detectLanguageFromText(text: string): 'en' | 'hi' | 'hinglish' {
  const hindiRegex = /[\u0900-\u097F]/;
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  const totalWords = text.split(/\s+/).length;

  if (hindiRegex.test(text)) {
    return 'hi';
  }

  // If there's a mix of English and Hinglish patterns
  if (totalWords > 0 && englishWords.length / totalWords > 0.5) {
    return 'en';
  }

  return 'en'; // Default to English
}
