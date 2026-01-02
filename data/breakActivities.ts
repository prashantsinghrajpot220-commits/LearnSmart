import { BreakActivity } from '@/types/productivity';

export const breakActivities: BreakActivity[] = [
  // Physical activities
  {
    id: '1',
    title: 'Stretch Your Body',
    description: 'Do some simple stretches for your neck, shoulders, and back',
    icon: '🧘',
    duration: 3,
    category: 'physical',
  },
  {
    id: '2',
    title: 'Take a Walk',
    description: 'Walk around your room or outside for fresh air',
    icon: '🚶',
    duration: 5,
    category: 'physical',
  },
  {
    id: '3',
    title: 'Drink Water',
    description: 'Stay hydrated! Drink a glass of water',
    icon: '💧',
    duration: 1,
    category: 'physical',
  },
  {
    id: '4',
    title: 'Eye Exercises',
    description: 'Look away from the screen and focus on distant objects',
    icon: '👁️',
    duration: 2,
    category: 'physical',
  },
  {
    id: '5',
    title: 'Deep Breathing',
    description: 'Take 10 deep breaths to relax your mind',
    icon: '🌬️',
    duration: 2,
    category: 'physical',
  },
  
  // Mental activities
  {
    id: '6',
    title: 'Quick Meditation',
    description: 'Close your eyes and focus on your breathing for 2 minutes',
    icon: '🧘‍♀️',
    duration: 3,
    category: 'mental',
  },
  {
    id: '7',
    title: 'Listen to Music',
    description: 'Play your favorite song and enjoy',
    icon: '🎵',
    duration: 4,
    category: 'mental',
  },
  {
    id: '8',
    title: 'Daydream',
    description: 'Let your mind wander freely for a moment',
    icon: '☁️',
    duration: 2,
    category: 'mental',
  },
  
  // Creative activities
  {
    id: '9',
    title: 'Doodle',
    description: 'Draw something fun on paper',
    icon: '✏️',
    duration: 4,
    category: 'creative',
  },
  {
    id: '10',
    title: 'Write a Poem',
    description: 'Write a short poem about what you just learned',
    icon: '📝',
    duration: 3,
    category: 'creative',
  },
  
  // Social activities
  {
    id: '11',
    title: 'Chat with a Friend',
    description: 'Quick message to say hi to someone',
    icon: '💬',
    duration: 3,
    category: 'social',
  },
  {
    id: '12',
    title: 'Call Family',
    description: 'Give a quick call to say hello',
    icon: '📞',
    duration: 5,
    category: 'social',
  },
];

export const getRandomBreakActivity = (): BreakActivity => {
  const randomIndex = Math.floor(Math.random() * breakActivities.length);
  return breakActivities[randomIndex];
};

export const getBreakActivityByCategory = (category: BreakActivity['category']): BreakActivity[] => {
  return breakActivities.filter((activity) => activity.category === category);
};
