export const CLASS_OPTIONS = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'Class 12+',
];

const CLASS_1_5_SUBJECTS = ['English', 'Hindi', 'Maths', 'EVS'];

const CLASS_6_10_SUBJECTS = ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'];

const CHAPTER_DATA: Record<string, Record<string, string[]>> = {
  English: {
    'Class 1': ['Neha\'s Alarm Clock', 'A Happy Child', 'Three Little Pigs'],
    'Class 2': ['First Day at School', 'Haldiram\'s', 'The Paddle-Pool'],
    'Class 3': ['The Magic Garden', 'Nina and the Baby Sparrows', 'Enormous Turnip'],
    'Class 4': ['Wake Up!', 'Noses', 'Run!'],
    'Class 5': ['Wonderful Waste!', 'Flying Together', 'Around the World'],
  },
  Hindi: {
    'Class 1': ['झूठा साथी', 'आम की कहानी', 'पतंग'],
    'Class 2': ['ऊँट चला', 'बोलो भाई', 'म्याऊँ'],
    'Class 3': ['कक्कू', 'शेखीबाज़ मक्खी', 'चांद से तोड़ी लकड़ी'],
    'Class 4': ['पापा जब बच्चे थे', 'दान का हिसाब', 'थप्पड़ रोटी खाओ'],
    'Class 5': ['राख की रस्सी', 'फसलों का त्योहार', 'बिस्कुट'],
  },
  Maths: {
    'Class 1': ['Shapes and Space', 'Numbers from One to Nine', 'Addition'],
    'Class 2': ['What is Long, What is Round?', 'Counting in Groups', 'How Much Can You Carry?'],
    'Class 3': ['Where to Look From?', 'Fun with Numbers', 'Give and Take'],
    'Class 4': ['Building with Bricks', 'Long and Short', 'A Trip to Bhopal'],
    'Class 5': ['The Fish Tale', 'Shapes and Angles', 'How Many Squares?'],
  },
  EVS: {
    'Class 1': ['Living and Non-living Things', 'My Body', 'Our Family'],
    'Class 2': ['Our Food', 'Clothes', 'Housing'],
    'Class 3': ['Poonam\'s Day out', 'The Plant Fairy', 'Water O\' Water!'],
    'Class 4': ['Going to School', 'Ear to Ear', 'A Day with Nandu'],
    'Class 5': ['Super Senses', 'A Snake Charmer\'s Story', 'From Tasting to Digesting'],
  },
  Mathematics: {
    'Class 6': ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers'],
    'Class 7': ['Integers', 'Fractions and Decimals', 'Data Handling'],
    'Class 8': ['Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals'],
    'Class 9': ['Number Systems', 'Polynomials', 'Coordinate Geometry'],
    'Class 10': ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables'],
  },
  Science: {
    'Class 6': ['Food: Where Does It Come From?', 'Components of Food', 'Fibre to Fabric'],
    'Class 7': ['Nutrition in Plants', 'Nutrition in Animals', 'Fibre to Fabric'],
    'Class 8': ['Crop Production and Management', 'Microorganisms: Friend and Foe', 'Synthetic Fibres and Plastics'],
    'Class 9': ['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules'],
    'Class 10': ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals'],
  },
  'Social Science': {
    'Class 6': ['History: What, Where, How and When?', 'Geography: The Earth in the Solar System', 'Civics: Understanding Diversity'],
    'Class 7': ['History: Tracing Changes Through a Thousand Years', 'Geography: Environment', 'Civics: On Equality'],
    'Class 8': ['History: How, When and Where', 'Geography: Resources', 'Civics: The Indian Constitution'],
    'Class 9': ['History: The French Revolution', 'Geography: India - Size and Location', 'Civics: What is Democracy? Why Democracy?'],
    'Class 10': ['History: The Rise of Nationalism in Europe', 'Geography: Resources and Development', 'Civics: Power Sharing'],
  },
};

export function getSubjectsForClass(className: string): string[] {
  const classNum = parseInt(className.replace('Class ', ''));

  if (classNum >= 1 && classNum <= 5) {
    return CLASS_1_5_SUBJECTS;
  } else if (classNum >= 6 && classNum <= 10) {
    return CLASS_6_10_SUBJECTS;
  } else if (classNum === 11 || classNum === 12) {
    return ['Stream Selection (Coming Soon)'];
  } else if (className === 'Class 12+') {
    return ['Competitive Exams', 'Skill Building'];
  }

  return [];
}

export function getChaptersForSubject(className: string, subject: string): string[] {
  if (className === 'Class 12+') {
    return ['Pathway Selection (Coming Soon)'];
  }

  if (subject === 'Stream Selection (Coming Soon)') {
    return ['Stream Selection (Coming Soon)'];
  }

  const chapters = CHAPTER_DATA[subject]?.[className] || [];

  if (chapters.length === 0) {
    return ['Chapters (Coming Soon)'];
  }

  return chapters;
}
