import { useQuizStore } from '@/store/quizStore';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_SYSTEM_PROMPT = `You are an expert quiz generator for educational content. Your task is to generate 5 unique, high-quality multiple choice questions based on the given topic.

## QUIZ GENERATION RULES:

### Question Quality:
- Questions should test understanding, not just memorization
- Include a mix of difficulty levels (2 easy, 2 medium, 1 challenging)
- Each question should be clear and unambiguous
- Use age-appropriate language for school students (Class 6-12)

### Format Requirements:
- Return exactly 5 questions in a JSON array
- Each question must have exactly 4 options (A, B, C, D)
- Exactly one option must be correct
- Provide a brief explanation for the correct answer

### Safety & Educational Standards:
- NEVER include harmful, dangerous, or inappropriate content
- Questions must be purely educational
- Avoid controversial or sensitive topics
- Focus on academic concepts and factual knowledge

### Response Format:
Return a JSON object with this structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

correctAnswer should be the index (0-3) of the correct option.`;

export async function generateQuizQuestions(
  className: string,
  subject: string,
  chapter: string
): Promise<QuizQuestion[]> {
  const { setLoading, setError } = useQuizStore.getState();

  setLoading(true);
  setError(null);

  try {
    // Build context-aware prompt
    const userPrompt = `Generate 5 multiple choice questions about "${chapter}" for ${className} students studying ${subject}.

Requirements:
- Each question should test different aspects of the chapter
- Include conceptual questions, application questions, and factual recall
- Make options plausible but clearly distinguishable
- Provide educational explanations

Topic content context:
${chapter} in ${subject} for ${className}

Please generate fresh, unique questions - do not repeat questions from previous quizzes.`;

    // If no API key, generate fallback quiz
    if (!OPENAI_API_KEY) {
      const fallbackQuestions = generateFallbackQuiz(className, subject, chapter);
      setLoading(false);
      return fallbackQuestions;
    }

    // Make API call to OpenAI
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: QUIZ_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Quiz API Error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse the JSON response
    const parsedResponse = parseQuizResponse(content);
    
    if (!parsedResponse || !parsedResponse.questions || parsedResponse.questions.length === 0) {
      throw new Error('Failed to parse quiz questions');
    }

    // Add unique IDs and validate
    const questions: QuizQuestion[] = parsedResponse.questions.map((q, index) => ({
      id: `quiz-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    setLoading(false);
    return questions;

  } catch (error) {
    console.error('Quiz Generation Error:', error);
    setError(error instanceof Error ? error.message : 'Failed to generate quiz questions');
    setLoading(false);
    
    // Return fallback quiz on error
    return generateFallbackQuiz(className, subject, chapter);
  }
}

interface ParsedQuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

function parseQuizResponse(content: string): ParsedQuizResponse | null {
  try {
    // Try to parse directly
    return JSON.parse(content);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        console.error('Failed to parse quiz JSON from markdown');
      }
    }
    
    // Try to find JSON object in text
    const braceMatch = content.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {
        console.error('Failed to parse quiz JSON from text');
      }
    }
    
    return null;
  }
}

function generateFallbackQuiz(
  _className: string,
  _subject: string,
  chapter: string
): QuizQuestion[] {
  // Generate basic educational questions based on chapter name
  const baseQuestions: Record<string, QuizQuestion[]> = {
    'Chemical Reactions and Equations': [
      {
        id: 'fallback-1',
        question: 'What is a chemical reaction?',
        options: [
          'A physical change in matter',
          'A process where substances change into different substances',
          'Mixing two liquids together',
          'Heating a substance until it melts',
        ],
        correctAnswer: 1,
        explanation: 'A chemical reaction is a process where reactants transform into products with different chemical properties.',
      },
      {
        id: 'fallback-2',
        question: 'Which of the following is NOT a sign of a chemical reaction?',
        options: [
          'Change in color',
          'Production of gas',
          'Change in temperature',
          'Change in shape without chemical change',
        ],
        correctAnswer: 3,
        explanation: 'Change in shape without chemical change is a physical change, not a chemical reaction.',
      },
      {
        id: 'fallback-3',
        question: 'In a balanced chemical equation, what must be conserved?',
        options: [
          'Mass only',
          'Atoms of each element',
          'Volume of gases',
          'Temperature',
        ],
        correctAnswer: 1,
        explanation: 'According to the law of conservation of mass, atoms of each element must be equal on both sides.',
      },
      {
        id: 'fallback-4',
        question: 'What type of reaction is represented by: A + B → AB?',
        options: [
          'Decomposition reaction',
          'Combination reaction',
          'Displacement reaction',
          'Double displacement reaction',
        ],
        correctAnswer: 1,
        explanation: 'A combination reaction (or synthesis) is when two or more substances combine to form a single product.',
      },
      {
        id: 'fallback-5',
        question: 'What does the arrow (→) in a chemical equation indicate?',
        options: [
          'Equals sign',
          'Direction of reaction from reactants to products',
          'Heat being added',
          'Catalyst presence',
        ],
        correctAnswer: 1,
        explanation: 'The arrow shows the direction of the reaction, indicating reactants transform into products.',
      },
    ],
    default: [
      {
        id: 'fallback-1',
        question: `What is the main focus of the chapter "${chapter}"?`,
        options: [
          `Understanding ${chapter} fundamentals and key concepts`,
          'Memorizing dates and facts',
          'Learning random unrelated topics',
          'Solving complex mathematical problems',
        ],
        correctAnswer: 0,
        explanation: `This chapter focuses on building understanding of ${chapter} fundamentals.`,
      },
      {
        id: 'fallback-2',
        question: `Which statement best describes "${chapter}"?`,
        options: [
          `An advanced topic requiring prior knowledge of ${chapter}`,
          `An introductory chapter covering ${chapter} basics`,
          'A review of previous topics',
          'An optional supplementary chapter',
        ],
        correctAnswer: 1,
        explanation: `This chapter introduces the fundamental concepts of ${chapter}.`,
      },
      {
        id: 'fallback-3',
        question: 'What is the best way to learn this chapter effectively?',
        options: [
          'Memorizing without understanding',
          'Active practice and concept application',
          'Skipping difficult sections',
          'Only reading once',
        ],
        correctAnswer: 1,
        explanation: 'Active practice and applying concepts is the most effective learning strategy.',
      },
      {
        id: 'fallback-4',
        question: 'Why is it important to understand this chapter?',
        options: [
          'It is required for exams only',
          'It builds foundation for advanced topics',
          'It is not actually important',
          'Only teachers need to understand it',
        ],
        correctAnswer: 1,
        explanation: 'Understanding fundamentals builds the foundation for learning advanced concepts.',
      },
      {
        id: 'fallback-5',
        question: `What should you do if you find "${chapter}" challenging?`,
        options: [
          'Give up immediately',
          'Ask for help and practice more',
          'Skip to the next chapter',
          'Copy answers from others',
        ],
        correctAnswer: 1,
        explanation: 'Seeking help and practicing consistently is the best approach to overcome challenges.',
      },
    ],
  };

  return baseQuestions[chapter] || baseQuestions.default.map((q, index) => ({
    ...q,
    id: `fallback-${Date.now()}-${index}`,
  }));
}

export async function validateQuizQuestions(questions: QuizQuestion[]): Promise<boolean> {
  if (!Array.isArray(questions) || questions.length === 0) {
    return false;
  }

  for (const question of questions) {
    // Validate question structure
    if (!question.id || !question.question || !question.explanation) {
      return false;
    }

    // Validate options
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      return false;
    }

    // Validate correct answer index
    if (
      typeof question.correctAnswer !== 'number' ||
      question.correctAnswer < 0 ||
      question.correctAnswer > 3
    ) {
      return false;
    }

    // Validate all options are non-empty strings
    if (!question.options.every((opt) => typeof opt === 'string' && opt.trim().length > 0)) {
      return false;
    }
  }

  return true;
}
