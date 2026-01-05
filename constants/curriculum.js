"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBJECT_EXPLANATIONS = exports.KNOWLEDGE_BASE = exports.SubjectCategory = exports.CLASS_OPTIONS = void 0;
exports.getSubjectsForClass = getSubjectsForClass;
exports.getChaptersForSubject = getChaptersForSubject;
exports.getPathwaysForCategory = getPathwaysForCategory;
exports.getPathwayChapters = getPathwayChapters;
exports.getChapterLessons = getChapterLessons;
exports.getPathwayCategories = getPathwayCategories;
exports.needsStreamSelection = needsStreamSelection;
exports.getStudyTip = getStudyTip;
exports.getExamPrepTip = getExamPrepTip;
exports.getMisconception = getMisconception;
exports.getCareerPaths = getCareerPaths;
exports.CLASS_OPTIONS = [
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
var CLASS_1_5_SUBJECTS = ['English', 'Hindi', 'Maths', 'EVS'];
var CLASS_6_8_SUBJECTS = [
    'Mathematics',
    'Science',
    'Social Science',
    'English I',
    'English II',
    'English Grammar',
    'Hindi I',
    'Hindi II',
    'Hindi Grammar'
];
var CLASS_9_10_SUBJECTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Social Science',
    'English I',
    'English II',
    'English Grammar',
    'Hindi I',
    'Hindi II',
    'Hindi Grammar'
];
var STREAM_SUBJECTS = {
    Science: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    Commerce: ['Economics', 'Accounts', 'Business Studies', 'Mathematics', 'English'],
    Arts: ['History', 'Geography', 'Political Science', 'English', 'Hindi'],
};
var PATHWAY_CATEGORIES = [
    { id: 'competitive', name: 'Competitive Exams', icon: '🎯' },
    { id: 'skills', name: 'Skill Building', icon: '🛠️' },
];
var PATHWAY_DATA = {
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
var CHAPTER_DATA = {
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
    },
    Physics: {
        'Class 9': ['Motion', 'Force and Laws of Motion', 'Gravitation'],
        'Class 10': ['Light Reflection and Refraction', 'Human Eye and Colorful World', 'Electricity'],
        'Class 11': ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Laws of Motion', 'Work, Energy and Power'],
        'Class 12': ['Electric Charges and Fields', 'Electrostatic Potential', 'Current Electricity', 'Moving Charges', 'Magnetism'],
    },
    Chemistry: {
        'Class 9': ['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules'],
        'Class 10': ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals'],
        'Class 11': ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'Thermodynamics'],
        'Class 12': ['Solutions', 'Electrochemistry', 'Surface Chemistry', 'd-block Elements', 'Alcohols and Phenols'],
    },
    Biology: {
        'Class 9': ['The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms'],
        'Class 10': ['Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?'],
        'Class 11': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology'],
        'Class 12': ['Reproduction in Organisms', 'Genetics', 'Evolution', 'Ecology', 'Biotechnology'],
    },
    'English I': {
        'Class 9': ['The Fun They Had', 'The Sound of Music'],
        'Class 10': ['A Letter to God', 'Nelson Mandela: Long Walk to Freedom'],
    },
    'English II': {
        'Class 9': ['The Lost Child', 'The Adventures of Toto'],
        'Class 10': ['A Triumph of Surgery', 'The Thief\'s Story'],
    },
    'English Grammar': {
        'Class 9': ['Tenses', 'Modals', 'Determiners'],
        'Class 10': ['Tenses', 'Modals', 'Reporting'],
    },
    'Hindi I': {
        'Class 9': ['दो बैलों की कथा', 'ल्हासा की ओर'],
        'Class 10': ['सूरदास के पद', 'राम-लक्ष्मण-परशुराम संवाद'],
    },
    'Hindi II': {
        'Class 9': ['गिल्लू', 'स्मृति'],
        'Class 10': ['हरिहर काका', 'सपनों के-से दिन'],
    },
    'Hindi Grammar': {
        'Class 9': ['शब्द निर्माण', 'अर्थ की दृष्टि से वाक्य भेद'],
        'Class 10': ['पद परिचय', 'वाक्य के भेद'],
    },
    'Social Science': {
        'Class 6': ['History: What, Where, How and When?', 'Geography: The Earth in the Solar System', 'Civics: Understanding Diversity'],
        'Class 7': ['History: Tracing Changes Through a Thousand Years', 'Geography: Environment', 'Civics: On Equality'],
        'Class 8': ['History: How, When and Where', 'Geography: Resources', 'Civics: The Indian Constitution'],
        'Class 9': ['History: The French Revolution', 'Geography: India - Size and Location', 'Civics: What is Democracy? Why Democracy?'],
        'Class 10': ['History: The Rise of Nationalism in Europe', 'Geography: Resources and Development', 'Civics: Power Sharing'],
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
var SubjectCategory;
(function (SubjectCategory) {
    SubjectCategory["SCIENCE"] = "Science";
    SubjectCategory["MATHEMATICS"] = "Mathematics";
    SubjectCategory["SOCIAL_SCIENCE"] = "Social Science";
    SubjectCategory["ENGLISH"] = "English";
    SubjectCategory["HINDI"] = "Hindi";
    SubjectCategory["PHYSICS"] = "Physics";
    SubjectCategory["CHEMISTRY"] = "Chemistry";
    SubjectCategory["BIOLOGY"] = "Biology";
    SubjectCategory["GRAMMAR"] = "Grammar";
})(SubjectCategory || (exports.SubjectCategory = SubjectCategory = {}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var LESSON_DATA = {
    'Class 9': {
        Physics: {
            'Motion': [
                {
                    title: 'Introduction to Motion',
                    icon: '🏃',
                    bulletPoints: [
                        'Motion is a change in position with time',
                        'Distance is the total path length traveled',
                        'Displacement is the shortest distance from start to end',
                        'Uniform motion covers equal distance in equal time',
                    ],
                    paragraphs: [
                        'In our daily life, we see some objects at rest and others in motion. Birds fly, fish swim, blood flows through veins and arteries, and cars move. Atoms, molecules, planets, stars and galaxies are all in motion. We often perceive an object to be in motion when its position changes with time.',
                    ],
                    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1000',
                    diagramData: {
                        type: 'motion',
                        labels: [
                            { text: 'Start (A)', x: 20, y: 50, tooltip: 'The reference point' },
                            { text: 'End (B)', x: 80, y: 50, tooltip: 'Final position after 5 seconds' },
                            { text: 'Path', x: 50, y: 45, tooltip: 'The trajectory of the object' }
                        ],
                        animationType: 'motion'
                    }
                }
            ],
            'Force and Laws of Motion': [
                {
                    title: 'First Law of Motion',
                    icon: '🚀',
                    bulletPoints: [
                        'An object remains at rest unless acted upon by a force',
                        'Objects in motion stay in motion unless acted upon',
                        'This property is known as Inertia',
                    ],
                    paragraphs: [
                        'Newton\'s First Law of Motion states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external unbalanced force. This tendency of undisturbed objects to stay at rest or to keep moving with the same velocity is called inertia.',
                    ],
                    diagramData: {
                        type: 'physics',
                        labels: [
                            { text: 'Applied Force', x: 30, y: 30, tooltip: 'External push or pull' },
                            { text: 'Friction', x: 70, y: 70, tooltip: 'Opposing force' }
                        ],
                        animationType: 'slide'
                    }
                }
            ]
        },
        Chemistry: {
            'Atoms and Molecules': [
                {
                    title: 'Laws of Chemical Combination',
                    icon: '⚛️',
                    bulletPoints: [
                        'Law of conservation of mass: Mass cannot be created or destroyed',
                        'Law of constant proportions: Elements are always in fixed ratio',
                        'Dalton\'s atomic theory explains these laws',
                    ],
                    paragraphs: [
                        'The laws of chemical combination were established after much experimental work by Lavoisier and Joseph L. Proust. These laws form the foundation of chemical science by explaining how atoms combine to form molecules.',
                    ],
                    diagramData: {
                        type: 'chemistry',
                        labels: [
                            { text: 'Oxygen Atom', x: 50, y: 30, tooltip: 'Atomic mass 16u' },
                            { text: 'Hydrogen Atom', x: 30, y: 60, tooltip: 'Atomic mass 1u' },
                            { text: 'Chemical Bond', x: 45, y: 45, tooltip: 'Forces holding atoms together' }
                        ],
                        animationType: 'molecular'
                    }
                }
            ]
        },
        Biology: {
            'The Fundamental Unit of Life': [
                {
                    title: 'Cell Structure',
                    icon: '🧬',
                    bulletPoints: [
                        'The cell is the structural and functional unit of life',
                        'Robert Hooke discovered cells in 1665',
                        'Plasma membrane regulates entry/exit',
                        'Nucleus is the control center',
                    ],
                    paragraphs: [
                        'While examining a thin slice of cork, Robert Hooke saw that the cork resembled the structure of a honeycomb consisting of many little compartments. Cork is a substance which comes from the bark of a tree. In Latin, cell means "a little room".',
                    ],
                    diagramData: {
                        type: 'biology',
                        labels: [
                            { text: 'Nucleus', x: 50, y: 50, tooltip: 'Contains genetic material' },
                            { text: 'Cytoplasm', x: 70, y: 60, tooltip: 'Jelly-like substance' },
                            { text: 'Cell Membrane', x: 90, y: 50, tooltip: 'Outer boundary' }
                        ],
                        animationType: 'pulse'
                    }
                }
            ]
        },
        'English I': {
            'The Fun They Had': [
                {
                    title: 'The Mechanical Teacher',
                    icon: '🤖',
                    bulletPoints: [
                        'Story set in the year 2157',
                        'Children learn from mechanical teachers on screens',
                        'They find an old "real" book from the past',
                        'Margie hates her mechanical teacher',
                    ],
                    paragraphs: [
                        'Margie even wrote about it that night in her diary. On the page headed 17 May 2157, she wrote, "Today Tommy found a real book!" It was a very old book. Margie\'s grandfather once said that when he was a little boy his grandfather told him that there was a time when all stories were printed on paper.',
                    ],
                    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000'
                }
            ]
        }
    },
    'Class 10': {
        Chemistry: {
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
                        'A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another. When a chemical reaction occurs, the atoms that make up the reactants are rearranged to form different products. For example, when you burn wood, the carbon in the wood reacts with oxygen in the air to produce carbon dioxide and water vapor.',
                    ],
                    imageUrl: 'https://images.unsplash.com/photo-1532187875460-12d059c47a49?auto=format&fit=crop&q=80&w=1000',
                    diagramData: {
                        type: 'chemistry',
                        labels: [
                            { text: 'Reactants', x: 20, y: 50, tooltip: 'Magnesium and Oxygen' },
                            { text: 'Products', x: 80, y: 50, tooltip: 'Magnesium Oxide' }
                        ],
                        animationType: 'fade-in'
                    }
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
                        'Acids, bases, and salts are fundamental chemical compounds that we encounter in our daily lives. Lemon juice, vinegar, and stomach acid are examples of acids. They contain hydrogen ions (H+) that give them their characteristic sour taste. Bases like soap, baking soda, and bleach contain hydroxide ions (OH-) and feel slippery to the touch.',
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
                        'Acids are an essential part of chemistry and everyday life. In the kitchen, you find acids in lemon juice (citric acid), vinegar (acetic acid), and tomatoes (tartaric acid). In laboratories, strong acids like hydrochloric acid and sulfuric acid are used for various purposes.',
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
                        'Real numbers form the foundation of mathematics and include all the numbers we use in everyday life. They include whole numbers like 5, fractions like 3/4, and special numbers like π (pi) and √2 (square root of 2) that cannot be written as simple fractions.',
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
function getSubjectsForClass(className, stream) {
    var classNum = parseInt(className.replace('Class ', ''));
    if (classNum >= 1 && classNum <= 5) {
        return CLASS_1_5_SUBJECTS;
    }
    else if (classNum >= 6 && classNum <= 8) {
        return CLASS_6_8_SUBJECTS;
    }
    else if (classNum >= 9 && classNum <= 10) {
        return CLASS_9_10_SUBJECTS;
    }
    else if (classNum === 11 || classNum === 12) {
        if (stream && STREAM_SUBJECTS[stream]) {
            return STREAM_SUBJECTS[stream];
        }
        return ['Science', 'Commerce', 'Arts'];
    }
    else if (className === 'Class 12+') {
        return ['Competitive Exams', 'Skill Building'];
    }
    return [];
}
function getChaptersForSubject(className, subject) {
    var _a;
    if (className === 'Class 12+') {
        var category = PATHWAY_DATA[subject];
        if (category) {
            var chapters_1 = Object.keys(category);
            return chapters_1.length > 0 ? chapters_1 : ['Select a pathway'];
        }
        return ['Select a pathway'];
    }
    if (['Science', 'Commerce', 'Arts'].includes(subject)) {
        return ['Select a stream'];
    }
    if (subject === 'Select a stream') {
        return ['Select a stream'];
    }
    var chapters = ((_a = CHAPTER_DATA[subject]) === null || _a === void 0 ? void 0 : _a[className]) || [];
    if (chapters.length === 0) {
        var streamSubjects = STREAM_SUBJECTS[subject];
        if (streamSubjects) {
            return streamSubjects;
        }
        return ['Chapters (Coming Soon)'];
    }
    return chapters;
}
function getPathwaysForCategory(className, category) {
    if (className === 'Class 12+') {
        return PATHWAY_DATA[category]
            ? Object.keys(PATHWAY_DATA[category])
            : [];
    }
    return [];
}
function getPathwayChapters(category, pathway) {
    var _a;
    return ((_a = PATHWAY_DATA[category]) === null || _a === void 0 ? void 0 : _a[pathway]) || [];
}
function getChapterLessons(className, subject, chapter) {
    var classData = LESSON_DATA[className];
    if (!classData) {
        return getDefaultLesson(chapter);
    }
    var subjectData = classData[subject];
    if (!subjectData) {
        return getDefaultLesson(chapter);
    }
    var chapterData = subjectData[chapter];
    if (Array.isArray(chapterData)) {
        return chapterData;
    }
    var pathwayData = chapterData;
    if (pathwayData) {
        var firstKey = Object.keys(pathwayData)[0];
        if (firstKey) {
            return [pathwayData[firstKey]];
        }
    }
    return getDefaultLesson(chapter);
}
function getDefaultLesson(chapter) {
    return [
        {
            title: "".concat(chapter, " - Introduction"),
            icon: '📖',
            bulletPoints: [
                'This chapter introduces key concepts in this subject',
                'Understanding these fundamentals is essential for further learning',
                'Practice problems will help reinforce your understanding',
            ],
            paragraphs: [
                "Welcome to the chapter on ".concat(chapter, ". This material is designed to help you understand the fundamental concepts that form the basis of this subject. Take your time to read through the content carefully and try to connect new ideas with things you already know."),
            ],
        },
    ];
}
function getPathwayCategories() {
    return PATHWAY_CATEGORIES;
}
function needsStreamSelection(className) {
    var classNum = parseInt(className.replace('Class ', ''));
    return (classNum === 11 || classNum === 12) && className !== 'Class 12+';
}
// Smarty's Knowledge Base - Comprehensive educational content for AI responses
exports.KNOWLEDGE_BASE = {
    // General Study Tips
    studyTips: [
        "Break your study sessions into 25-minute chunks with 5-minute breaks (Pomodoro technique)",
        "Active recall is more effective than passive reading - test yourself often",
        "Spaced repetition helps you remember information long-term",
        "Teaching others what you've learned reinforces your own understanding",
        "Get enough sleep - your brain consolidates learning while you sleep",
        "Stay hydrated and eat healthy snacks for better focus",
        "Create a dedicated study space free from distractions",
        "Review material within 24 hours of learning it for better retention",
    ],
    // Time Management
    timeManagement: [
        "Use a planner or calendar to schedule study sessions",
        "Tackle difficult subjects when you're most alert",
        "Set specific goals for each study session",
        "Prioritize topics based on exam weight and your weak areas",
        "Balance study time across all subjects, not just favorites",
        "Leave buffer time for unexpected challenges",
        "Review weekly to stay on top of cumulative material",
    ],
    // Exam Preparation
    examPrep: [
        "Start preparing weeks before the exam, not days",
        "Practice with past papers to understand the exam format",
        "Focus on understanding concepts, not just memorizing",
        "Create summary sheets for quick revision",
        "Form study groups for discussion and peer learning",
        "Take care of yourself the night before - rest is crucial",
        "Read all questions carefully before answering",
        "Manage your time during the exam wisely",
    ],
    // Common Misconceptions
    misconceptions: {
        science: [
            "Myth: Lightning never strikes the same place twice. Fact: It can and does!",
            "Myth: The Great Wall of China is visible from space. Fact: It's barely visible!",
            "Myth: Humans only use 10% of their brains. Fact: We use all of it!",
            "Myth: Venomous snakes are always deadly. Fact: Most are not harmful to humans.",
        ],
        math: [
            "Myth: Math is about memorizing formulas. Fact: It's about understanding patterns!",
            "Myth: Some people are 'math people' and others aren't. Fact: Anyone can learn math with practice!",
            "Myth: You don't need math in real life. Fact: We use math constantly, often without noticing.",
        ],
        history: [
            "Myth: Napoleon was very short. Fact: He was average height for his time!",
            "Myth: Vikings wore horned helmets. Fact: That's a modern invention!",
            "Myth: The Middle Ages were called the 'Dark Ages' because it was dark. Fact: It referred to lack of historical records!",
        ],
    },
    // Career Guidance
    careerPaths: {
        science: [
            "Engineering - Design and build things that solve problems",
            "Medicine - Help people stay healthy and treat illnesses",
            "Research - Discover new knowledge about our world",
            "Environmental Science - Protect our planet",
            "Data Science - Analyze information to find patterns",
        ],
        commerce: [
            "Finance - Manage money and investments",
            "Marketing - Help products reach the right people",
            "Accounting - Track and organize financial records",
            "Business - Lead and grow organizations",
            "Economics - Understand how economies work",
        ],
        arts: [
            "Teaching - Shape young minds and inspire learning",
            "Journalism - Tell important stories to the world",
            "Design - Create beautiful and functional things",
            "Law - Help people navigate the legal system",
            "Psychology - Understand human behavior and mental health",
        ],
    },
};
// Helper function to get study tip
function getStudyTip() {
    var tips = exports.KNOWLEDGE_BASE.studyTips;
    return tips[Math.floor(Math.random() * tips.length)];
}
// Helper function to get exam prep tip
function getExamPrepTip() {
    var tips = exports.KNOWLEDGE_BASE.examPrep;
    return tips[Math.floor(Math.random() * tips.length)];
}
// Helper function to get misconception for a subject
function getMisconception(subject) {
    var key = subject.toLowerCase();
    var misconceptions = exports.KNOWLEDGE_BASE.misconceptions[key] || exports.KNOWLEDGE_BASE.misconceptions.science;
    return misconceptions[Math.floor(Math.random() * misconceptions.length)];
}
// Helper function to get career paths for a stream
function getCareerPaths(stream) {
    var key = stream.toLowerCase();
    return exports.KNOWLEDGE_BASE.careerPaths[key] || [];
}
// Subject explanations for Smarty's knowledge base
exports.SUBJECT_EXPLANATIONS = {
    Mathematics: "Mathematics is the study of numbers, quantities, shapes, and patterns. It develops logical thinking and problem-solving skills that are useful in many fields!",
    Physics: "Physics is the science of matter, energy, and how they interact. It explains everything from tiny atoms to entire galaxies!",
    Chemistry: "Chemistry is the study of substances - what they're made of, how they change, and how they interact. It's everywhere in daily life!",
    Biology: "Biology is the study of living things - from tiny cells to entire ecosystems. It helps us understand life itself!",
    "Social Science": "Social Science studies human society and relationships. It includes history, geography, civics, and economics.",
    English: "English develops your reading, writing, and communication skills. It's essential for expressing ideas clearly!",
    Hindi: "Hindi is one of India's major languages. Learning it opens doors to literature, culture, and communication!",
    EVS: "EVS (Environmental Studies) helps us understand the world around us - nature, people, and how we all connect!",
};
