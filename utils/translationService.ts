import { Language } from '@/services/LanguageDetectionService';

export const getLanguageInstruction = (lang: Language): string => {
  switch (lang) {
    case 'hi':
      return 'Please respond in Hindi (Devanagari script).';
    case 'hinglish':
      return 'Please respond in Hinglish (a mix of Hindi and English in Roman script). Use a friendly, conversational tone.';
    default:
      return 'Please respond in English.';
  }
};

export const translateStaticText = (text: string, _lang: Language): string => {
  // For UI elements that might need translation
  // This is a placeholder for a more comprehensive translation system
  return text;
};
