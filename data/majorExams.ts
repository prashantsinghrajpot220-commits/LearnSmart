import { Exam } from '@/types/productivity';

// Current year - dynamically adjust based on current date
const getCurrentYear = () => new Date().getFullYear();
const getNextYear = () => new Date().getFullYear() + 1;

export const majorExams: Exam[] = [
  {
    id: 'cbse-10',
    name: 'CBSE Class 10 Board',
    subject: 'All Subjects',
    date: `${getNextYear()}-03-15`,
    dateDisplay: 'March 15, 2025',
    color: 'yellow',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'cbse-12',
    name: 'CBSE Class 12 Board',
    subject: 'All Subjects',
    date: `${getNextYear()}-02-15`,
    dateDisplay: 'February 15, 2025',
    color: 'yellow',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'jee-main-1',
    name: 'JEE Main Session 1',
    subject: 'Physics, Chemistry, Maths',
    date: `${getNextYear()}-01-24`,
    dateDisplay: 'January 24, 2025',
    color: 'green',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'jee-main-2',
    name: 'JEE Main Session 2',
    subject: 'Physics, Chemistry, Maths',
    date: `${getNextYear()}-04-04`,
    dateDisplay: 'April 4, 2025',
    color: 'yellow',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'jee-main-3',
    name: 'JEE Main Session 3',
    subject: 'Physics, Chemistry, Maths',
    date: `${getNextYear()}-06-05`,
    dateDisplay: 'June 5, 2025',
    color: 'green',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'neet',
    name: 'NEET UG',
    subject: 'Physics, Chemistry, Biology',
    date: `${getNextYear()}-05-05`,
    dateDisplay: 'May 5, 2025',
    color: 'yellow',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    subject: 'Physics, Chemistry, Maths',
    date: `${getNextYear()}-05-20`,
    dateDisplay: 'May 20, 2025',
    color: 'green',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'viteee',
    name: 'VITEEE',
    subject: 'Physics, Chemistry, Maths',
    date: `${getNextYear()}-04-20`,
    dateDisplay: 'April 20, 2025',
    color: 'green',
    completed: false,
    isPrePopulated: true,
  },
  {
    id: 'sat',
    name: 'SAT',
    subject: 'Reading, Writing, Maths',
    date: `${getNextYear()}-03-08`,
    dateDisplay: 'March 8, 2025',
    color: 'green',
    completed: false,
    isPrePopulated: true,
  },
];

// Helper function to get days remaining for an exam
export const getDaysRemaining = (examDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to determine urgency color
export const getUrgencyColor = (daysRemaining: number): 'green' | 'yellow' | 'red' => {
  if (daysRemaining <= 7) return 'red';
  if (daysRemaining <= 30) return 'yellow';
  return 'green';
};

// Helper function to sort exams by date
export const sortExamsByDate = (exams: Exam[]): Exam[] => {
  return [...exams]
    .filter((exam) => !exam.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Get upcoming exams (not completed, in the future)
export const getUpcomingExams = (exams: Exam[], limit: number = 3): Exam[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sortExamsByDate(exams)
    .filter((exam) => new Date(exam.date) >= today)
    .slice(0, limit);
};
