const STUDY_DICTIONARY: Record<string, string> = {
  'intgral': 'integral',
  'diffrentiation': 'differentiation',
  'photosynthsis': 'photosynthesis',
  'gravitaton': 'gravitation',
  'algeba': 'algebra',
  'chemisty': 'chemistry',
  'biolgy': 'biology',
  'physcs': 'physics',
  'geometery': 'geometry',
  'trignometry': 'trigonometry',
  // Hinglish common typos
  'samjh': 'samajh',
  'smjh': 'samajh',
  'krte': 'karte',
  'kya h': 'kya hai',
  'smjhao': 'samjhao',
};

export const correctTypos = (text: string): string => {
  let correctedText = text;
  Object.keys(STUDY_DICTIONARY).forEach(typo => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    correctedText = correctedText.replace(regex, STUDY_DICTIONARY[typo]);
  });
  return correctedText;
};
