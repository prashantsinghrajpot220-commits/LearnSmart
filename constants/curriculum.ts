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

const STREAM_SUBJECTS: Record<string, string[]> = {
  Science: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
  Commerce: ['Economics', 'Accounts', 'Business Studies', 'Mathematics', 'English'],
  Arts: ['History', 'Geography', 'Political Science', 'English', 'Hindi'],
};

const PATHWAY_CATEGORIES = [
  { id: 'competitive', name: 'Competitive Exams', icon: '🎯' },
  { id: 'skills', name: 'Skill Building', icon: '🛠️' },
];

const PATHWAY_DATA: Record<string, Record<string, string[]>> = {
  'Competitive Exams': {
    JEE: ['Kinematics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
    NEET: ['Cell Structure', 'Genetics', 'Human Physiology', 'Ecology', 'Biomolecules'],
    UPSC: ['Ancient Indian History', 'Medieval India', 'Indian Polity', 'Geography', 'Economy'],
  },
  'Skill Building': {
    Coding: ['JavaScript Basics', 'React Fundamentals', 'API Integration', 'Database Design', 'Node.js'],
    Design: ['Design Principles', 'Color Theory', 'Typography', 'UI/UX Basics', 'Figma'],
    'Video Editing': ['Premiere Pro Basics', 'Color Grading', 'Effects', 'Audio', 'Export'],
  },
};

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
  Physics: {
    'Class 11': ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Laws of Motion', 'Work, Energy and Power'],
    'Class 12': ['Electric Charges and Fields', 'Electrostatic Potential', 'Current Electricity', 'Moving Charges', 'Magnetism'],
  },
  Chemistry: {
    'Class 11': ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'Thermodynamics'],
    'Class 12': ['Solutions', 'Electrochemistry', 'Surface Chemistry', 'd-block Elements', 'Alcohols and Phenols'],
  },
  Biology: {
    'Class 11': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology'],
    'Class 12': ['Reproduction in Organisms', 'Genetics', 'Evolution', 'Ecology', 'Biotechnology'],
  },
  Economics: {
    'Class 11': ['Introduction to Economics', 'Collection of Data', 'Organisation of Data', 'Presentation of Data', 'Measures of Central Tendency'],
    'Class 12': ['Consumer Equilibrium', 'Demand', 'Elasticity', 'Production', 'Cost'],
  },
  Accounts: {
    'Class 11': ['Introduction to Accounting', 'Theory Base of Accounting', 'Recording of Transactions', 'Bank Reconciliation', 'Depreciation'],
    'Class 12': ['Accounting for Partnership', 'Reconstitution of Partnership', 'Analysis of Financial Statements', 'Cash Flow Statement'],
  },
  'Business Studies': {
    'Class 11': ['Nature and Significance of Management', 'Principles of Management', 'Business Environment', 'Planning', 'Organising'],
    'Class 12': ['Nature and Significance of Principles', 'Directing', 'Controlling', 'Financial Markets', 'Marketing'],
  },
  History: {
    'Class 11': ['From the Beginning of Time', 'Writing and City Life', 'An Empire Across Two Continents', 'The Central Islamic Lands', 'Nomadic Empires'],
    'Class 12': ['Bricks, Beads and Bones', 'Kings, Farmers and Towns', 'Trade and Territory', 'Thinkers, Beliefs and Buildings', 'History of the Vijayanagara'],
  },
  Geography: {
    'Class 11': ['Geography as a Discipline', 'The Earth', 'Landforms', 'Climate', 'Oceans'],
    'Class 12': ['Human Geography', 'Migration', 'Human Development', 'Human Settlements', 'Land Resources'],
  },
  'Political Science': {
    'Class 11': ['Political Theory: An Introduction', 'Freedom', 'Equality', 'Social Justice', 'Rights'],
    'Class 12': ['Concept of Constitution', 'Rights in the Indian Constitution', 'Organs of Government', 'State Government', 'Local Government'],
  },
};

export interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
}

const LESSON_DATA: Record<string, any> = {
  'Class 10': {
    Science: {
      'Chemical Reactions and Equations': [
        {
          title: 'What is a Chemical Reaction?',
          icon: '⚗️',
          bulletPoints: [
            'A chemical reaction is a process where substances change into different substances',
            'The original substances are called reactants, and the new substances are products',
            'Chemical reactions involve breaking and forming of chemical bonds',
            'Signs of a chemical reaction include change in color, gas production, or temperature change',
          ],
          paragraphs: [
            'A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another. When a chemical reaction occurs, the atoms that make up the reactants are rearranged to form different products. For example, when you burn wood, the carbon in the wood reacts with oxygen in the air to produce carbon dioxide and water vapor. This is why you see flames and feel heat - it is energy being released during the reaction.',
          ],
        },
        {
          title: 'Acids, Bases and Salts',
          icon: '🧪',
          bulletPoints: [
            'Acids taste sour and turn blue litmus paper red',
            'Bases taste bitter and feel slippery, turning red litmus blue',
            'Salts are formed when acids react with bases',
            'pH scale measures how acidic or basic a solution is',
          ],
          paragraphs: [
            'Acids, bases, and salts are fundamental chemical compounds that we encounter in our daily lives. Lemon juice, vinegar, and stomach acid are examples of acids. They contain hydrogen ions (H+) that give them their characteristic sour taste. Bases like soap, baking soda, and bleach contain hydroxide ions (OH-) and feel slippery to the touch. When an acid and base react together, they neutralize each other and form a salt and water.',
          ],
        },
      ],
      'Acids, Bases and Salts': [
        {
          title: 'Understanding Acids',
          icon: '🍋',
          bulletPoints: [
            'Acids are substances that release hydrogen ions (H+) in water',
            'They have a sour taste and pH less than 7',
            'Common acids include hydrochloric acid, sulfuric acid, and citric acid',
            'Acids can be organic or inorganic',
          ],
          paragraphs: [
            'Acids are an essential part of chemistry and everyday life. In the kitchen, you find acids in lemon juice (citric acid), vinegar (acetic acid), and tomatoes (tartaric acid). In laboratories, strong acids like hydrochloric acid and sulfuric acid are used for various purposes. Understanding acids helps us understand how they react with other substances and their importance in industry and medicine.',
          ],
        },
      ],
    },
    Mathematics: {
      'Real Numbers': [
        {
          title: 'Real Numbers',
          icon: '🔢',
          bulletPoints: [
            'Real numbers include both rational and irrational numbers',
            'Rational numbers can be expressed as fractions',
            'Irrational numbers cannot be expressed as simple fractions',
            'Every real number has a decimal representation',
          ],
          paragraphs: [
            'Real numbers form the foundation of mathematics and include all the numbers we use in everyday life. They include whole numbers like 5, fractions like 3/4, and special numbers like π (pi) and √2 (square root of 2) that cannot be written as simple fractions. Understanding real numbers is essential for solving equations and understanding more advanced mathematical concepts.',
          ],
        },
      ],
    },
  },
  'Class 12+': {
    'Competitive Exams': {
      JEE: {
        'Kinematics': {
          title: 'Kinematics',
          icon: '📐',
          bulletPoints: [
            'Kinematics describes motion without considering its causes',
            'Key concepts include displacement, velocity, and acceleration',
            'Equations of motion relate these quantities',
            'Projectile motion combines horizontal and vertical motion',
          ],
          paragraphs: [
            'Kinematics is the branch of mechanics that describes the motion of objects without considering the forces that cause the motion. It is fundamental to understanding physics and is heavily tested in JEE. The three equations of motion (v = u + at, s = ut + ½at², v² = u² + 2as) form the backbone of this chapter and can solve most kinematics problems.',
          ],
        },
        'Thermodynamics': {
          title: 'Thermodynamics',
          icon: '🌡️',
          bulletPoints: [
            'Thermodynamics deals with heat, work, and energy transfer',
            'Zeroth law establishes thermal equilibrium',
            'First law is conservation of energy',
            'Second law defines entropy and direction of processes',
          ],
          paragraphs: [
            'Thermodynamics is the study of relationships between heat, work, temperature, and energy. The laws of thermodynamics govern everything from engine efficiency to the behavior of the universe. The first law states that energy cannot be created or destroyed, only transformed. The second law introduces entropy, explaining why some processes happen naturally while others require external energy.',
          ],
        },
        'Electromagnetism': {
          title: 'Electromagnetism',
          icon: '⚡',
          bulletPoints: [
            'Electric charges create electric and magnetic fields',
            'Maxwell\'s equations unify electricity and magnetism',
            'Electromagnetic waves include light, radio, and X-rays',
            'Lorentz force describes charged particle motion in fields',
          ],
          paragraphs: [
            'Electromagnetism is one of the four fundamental forces of nature and is responsible for light, electricity, and magnetism. James Maxwell unified electricity and magnetism into a single theory, predicting the existence of electromagnetic waves that travel at the speed of light. This chapter covers electric fields, magnetic fields, electromagnetic induction, and alternating currents.',
          ],
        },
      },
      NEET: {
        'Cell Structure': {
          title: 'Cell Structure',
          icon: '🔬',
          bulletPoints: [
            'Cell is the basic unit of life',
            'Prokaryotic cells lack a nucleus, eukaryotic cells have one',
            'Organelles have specific functions within the cell',
            'Cell membrane controls what enters and exits',
          ],
          paragraphs: [
            'The cell is the fundamental structural and functional unit of all living organisms. Cells are often called "building blocks of life." Prokaryotic cells, found in bacteria, are simpler and lack a defined nucleus. Eukaryotic cells, found in plants and animals, have complex structures including a nucleus that houses DNA, mitochondria for energy production, and endoplasmic reticulum for protein synthesis.',
          ],
        },
        'Genetics': {
          title: 'Genetics',
          icon: '🧬',
          bulletPoints: [
            'DNA stores genetic information in genes',
            'Mendel\'s laws explain inheritance patterns',
            'Chromosomes carry genes in cells',
            'Mutations can change genetic information',
          ],
          paragraphs: [
            'Genetics is the branch of biology that studies genes, heredity, and variation in living organisms. Gregor Mendel, known as the father of genetics, discovered the fundamental laws of inheritance through his pea plant experiments. Understanding genetics is crucial for NEET as it explains how traits are passed from parents to offspring and how genetic disorders occur.',
          ],
        },
      },
      UPSC: {
        'Ancient Indian History': {
          title: 'Ancient Indian History',
          icon: '🏛️',
          bulletPoints: [
            'Indus Valley Civilization was urban and advanced',
            'Vedic period saw the composition of Vedas',
            'Mauryan Empire was India\'s first major empire',
            'Gupta period is called the Golden Age of India',
          ],
          paragraphs: [
            'Ancient Indian History covers the period from the Stone Age to the 8th century CE. The Indus Valley Civilization (3300-1300 BCE) was one of the world\'s earliest urban cultures with sophisticated town planning. The Vedic period saw the composition of the Rigveda and other sacred texts. The Mauryan Empire under Ashoka unified most of India, while the Gupta period witnessed remarkable achievements in science, mathematics, and arts.',
          ],
        },
      },
    },
    'Skill Building': {
      Coding: {
        'JavaScript Basics': {
          title: 'JavaScript Basics',
          icon: '💻',
          bulletPoints: [
            'JavaScript is the language of the web',
            'Variables store data using let, const, and var',
            'Functions are reusable blocks of code',
            'Objects store data as key-value pairs',
          ],
          paragraphs: [
            'JavaScript is the programming language that makes websites interactive and dynamic. Originally created for web browsers, it now runs on servers, mobile devices, and even robots. Understanding JavaScript fundamentals like variables, functions, and objects is essential before moving to frameworks like React. JavaScript\'s flexible nature allows you to build everything from simple calculators to complex web applications.',
          ],
        },
        'React Fundamentals': {
          title: 'React Fundamentals',
          icon: '⚛️',
          bulletPoints: [
            'React uses components to build user interfaces',
            'JSX combines HTML and JavaScript',
            'State manages dynamic data in components',
            'Props pass data between components',
          ],
          paragraphs: [
            'React is a popular JavaScript library developed by Facebook for building user interfaces. It uses a component-based architecture where reusable UI elements manage their own state. JSX allows you to write HTML-like code directly in JavaScript, making it easier to visualize the UI structure. Understanding the component lifecycle and state management is crucial for building dynamic web applications.',
          ],
        },
      },
      Design: {
        'Design Principles': {
          title: 'Design Principles',
          icon: '🎨',
          bulletPoints: [
            'Balance distributes visual weight evenly',
            'Contrast makes elements stand out',
            'Alignment creates visual connections',
            'Hierarchy guides the viewer\'s attention',
          ],
          paragraphs: [
            'Design principles are fundamental guidelines that help create visually appealing and functional designs. Balance can be symmetrical (equal on both sides) or asymmetrical (different elements that balance each other). Contrast helps important elements stand out and improves readability. Good alignment creates a sense of order and professionalism, while hierarchy ensures users can easily understand the most important information first.',
          ],
        },
        'Color Theory': {
          title: 'Color Theory',
          icon: '🌈',
          bulletPoints: [
            'Primary colors combine to create secondary colors',
            'Color wheels show color relationships',
            'Warm colors feel energetic, cool colors feel calm',
            'Color psychology affects user emotions',
          ],
          paragraphs: [
            'Color theory is the science and art of using colors. The color wheel shows primary (red, yellow, blue), secondary (orange, green, purple), and tertiary colors. Understanding color harmony helps create pleasing combinations. Warm colors like red and orange evoke energy and urgency, while cool colors like blue and green create calm and trust. Choosing the right colors for your design can significantly impact user experience and brand perception.',
          ],
        },
      },
    },
  },
};

export function getSubjectsForClass(className: string, stream?: string): string[] {
  const classNum = parseInt(className.replace('Class ', ''));

  if (classNum >= 1 && classNum <= 5) {
    return CLASS_1_5_SUBJECTS;
  } else if (classNum >= 6 && classNum <= 10) {
    return CLASS_6_10_SUBJECTS;
  } else if (classNum === 11 || classNum === 12) {
    if (stream && STREAM_SUBJECTS[stream]) {
      return STREAM_SUBJECTS[stream];
    }
    return ['Science', 'Commerce', 'Arts'];
  } else if (className === 'Class 12+') {
    return ['Competitive Exams', 'Skill Building'];
  }

  return [];
}

export function getChaptersForSubject(className: string, subject: string): string[] {
  if (className === 'Class 12+') {
    const category = PATHWAY_DATA[subject as keyof typeof PATHWAY_DATA];
    if (category) {
      const chapters = Object.keys(category);
      return chapters.length > 0 ? chapters : ['Select a pathway'];
    }
    return ['Select a pathway'];
  }

  if (['Science', 'Commerce', 'Arts'].includes(subject)) {
    return ['Select a stream'];
  }

  if (subject === 'Select a stream') {
    return ['Select a stream'];
  }

  const chapters = CHAPTER_DATA[subject]?.[className] || [];

  if (chapters.length === 0) {
    const streamSubjects = STREAM_SUBJECTS[subject as keyof typeof STREAM_SUBJECTS];
    if (streamSubjects) {
      return streamSubjects;
    }
    return ['Chapters (Coming Soon)'];
  }

  return chapters;
}

export function getPathwaysForCategory(className: string, category: string): string[] {
  if (className === 'Class 12+') {
    return PATHWAY_DATA[category as keyof typeof PATHWAY_DATA] 
      ? Object.keys(PATHWAY_DATA[category as keyof typeof PATHWAY_DATA])
      : [];
  }
  return [];
}

export function getPathwayChapters(
  category: string,
  pathway: string
): string[] {
  return PATHWAY_DATA[category as keyof typeof PATHWAY_DATA]?.[pathway] || [];
}

export function getChapterLessons(
  className: string,
  subject: string,
  chapter: string
): LessonContent[] {
  const classData = LESSON_DATA[className];
  if (!classData) {
    return getDefaultLesson(chapter);
  }

  const subjectData = classData[subject];
  if (!subjectData) {
    return getDefaultLesson(chapter);
  }

  const chapterData = subjectData[chapter];
  if (Array.isArray(chapterData)) {
    return chapterData as LessonContent[];
  }

  const pathwayData = chapterData as Record<string, LessonContent>;
  if (pathwayData) {
    const firstKey = Object.keys(pathwayData)[0];
    if (firstKey) {
      return [pathwayData[firstKey]];
    }
  }

  return getDefaultLesson(chapter);
}

function getDefaultLesson(chapter: string): LessonContent[] {
  return [
    {
      title: `${chapter} - Introduction`,
      icon: '📖',
      bulletPoints: [
        'This chapter introduces key concepts in this subject',
        'Understanding these fundamentals is essential for further learning',
        'Practice problems will help reinforce your understanding',
      ],
      paragraphs: [
        `Welcome to the chapter on ${chapter}. This material is designed to help you understand the fundamental concepts that form the basis of this subject. Take your time to read through the content carefully and try to connect new ideas with things you already know.`,
      ],
    },
  ];
}

export function getPathwayCategories() {
  return PATHWAY_CATEGORIES;
}

export function needsStreamSelection(className: string): boolean {
  const classNum = parseInt(className.replace('Class ', ''));
  return (classNum === 11 || classNum === 12) && className !== 'Class 12+';
}
