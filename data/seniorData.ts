// Hardcoded pathways data for 12+ users (high school graduates)
// Categories: Competitive Exams and Skill Building

export const SENIOR_PATHWAYS = [
  {
    id: 'p1',
    category: 'Competitive Exams',
    title: 'JEE Prep',
    icon: 'calculator',
    description: 'Joint Entrance Examination preparation for engineering aspirants'
  },
  {
    id: 'p2',
    category: 'Competitive Exams',
    title: 'NEET Prep',
    icon: 'activity',
    description: 'National Eligibility cum Entrance Test for medical students'
  },
  {
    id: 'p3',
    category: 'Competitive Exams',
    title: 'UPSC Prep',
    icon: 'target',
    description: 'Civil Services Examination preparation for government jobs'
  },
  {
    id: 'p4',
    category: 'Skill Building',
    title: 'Web Development',
    icon: 'code',
    description: 'Learn to build modern websites and web applications'
  },
  {
    id: 'p5',
    category: 'Skill Building',
    title: 'Video Editing',
    icon: 'video',
    description: 'Master video editing skills for content creation'
  },
  {
    id: 'p6',
    category: 'Skill Building',
    title: 'Graphic Design',
    icon: 'layers',
    description: 'Learn design principles and create stunning visuals'
  }
];

export const PATHWAY_CATEGORIES = [
  'Competitive Exams',
  'Skill Building'
];

// Helper function to get pathways by category
export function getPathwaysByCategory(category) {
  return SENIOR_PATHWAYS.filter(pathway => pathway.category === category);
}

// Helper function to get pathway by ID
export function getPathwayById(id) {
  return SENIOR_PATHWAYS.find(pathway => pathway.id === id);
}
