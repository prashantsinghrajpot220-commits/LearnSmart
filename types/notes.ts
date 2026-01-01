export interface VoiceNote {
  id: string;
  title: string;
  originalTranscript: string;
  summarizedContent: string;
  subject?: string;
  chapter?: string;
  tags: string[];
  duration: number;
  createdAt: number;
  updatedAt: number;
  language: 'en' | 'hi' | 'hinglish';
  isStarred: boolean;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: 'en' | 'hi' | 'hinglish';
  timestamp: number;
}

export interface SummarizationResult {
  summary: string;
  keyPoints: string[];
  keywords: string[];
  suggestedTitle: string;
  suggestedTags: string[];
}
