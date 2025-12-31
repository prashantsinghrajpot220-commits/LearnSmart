export type Language = 'en' | 'hi' | 'hinglish';

export const detectLanguage = (text: string): Language => {
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) {
    return 'hi';
  }

  // Hinglish detection is tricky, but often involves common Hindi words in Roman script
  const hinglishKeywords = [
    'kya', 'hai', 'kaise', 'hota', 'hai', 'mujhe', 'samajh', 'nahi', 'aa', 'raha', 
    'krte', 'ho', 'mein', 'samjhao', 'btao', 'kab', 'kon', 'kahan'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  const hinglishCount = words.filter(word => hinglishKeywords.includes(word)).length;
  
  if (hinglishCount > 0) {
    return 'hinglish';
  }

  return 'en';
};
