import { QuizQuestion, QuizGenerationOptions, DifficultyLevel } from '@/types/quiz';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

interface QuizContext {
  subject: string;
  chapter: string;
  lessonContent?: string;
  difficulty: DifficultyLevel;
  studentClass?: string;
  studentStream?: string;
  topic?: string;
}

export class AIQuizGeneratorService {
  private static instance: AIQuizGeneratorService;

  private constructor() {}

  public static getInstance(): AIQuizGeneratorService {
    if (!AIQuizGeneratorService.instance) {
      AIQuizGeneratorService.instance = new AIQuizGeneratorService();
    }
    return AIQuizGeneratorService.instance;
  }

  async generateQuiz(options: QuizGenerationOptions): Promise<QuizQuestion[]> {
    const {
      subject,
      chapter,
      lessonContent,
      difficulty = 'medium',
      questionCount = 5,
      topic,
    } = options;

    if (!OPENAI_API_KEY) {
      return this.getFallbackQuiz(subject, chapter, difficulty, questionCount);
    }

    try {
      const prompt = this.buildQuizPrompt({
        subject,
        chapter,
        lessonContent,
        difficulty,
        topic,
      });

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return this.parseQuizResponse(content, subject, chapter, difficulty, topic || chapter);
    } catch (error) {
      // Error generating quiz, returning fallback
      return this.getFallbackQuiz(subject, chapter, difficulty, questionCount);
    }
  }

  private getSystemPrompt(): string {
    return `You are an expert educational quiz generator for NCERT curriculum students (Class 1-12).

Your task is to generate high-quality multiple-choice questions based on the provided subject and chapter content.

**Requirements:**
1. Generate exactly the requested number of questions (5 by default)
2. Each question must have exactly 4 options (A, B, C, D)
3. Only ONE correct answer per question
4. Questions must be age-appropriate for the class level
5. Difficulty must match the specified level (easy/medium/hard)
6. Provide clear, concise explanations for the correct answer
7. Questions should test understanding, not just memorization
8. Avoid repeating questions within the same quiz

**Difficulty Guidelines:**
- Easy: Basic facts, definitions, direct recall
- Medium: Application of concepts, simple problem-solving
- Hard: Complex problem-solving, analysis, synthesis

**Response Format:**
Return ONLY a JSON array with the following structure:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Clear explanation of why this is correct"
  }
]

Note: correctAnswer should be 0, 1, 2, or 3 (index of correct option in the options array).`;
  }

  private buildQuizPrompt(context: QuizContext): string {
    let prompt = `Generate ${5} multiple-choice questions for the following topic:\n\n`;
    prompt += `**Subject:** ${context.subject}\n`;
    prompt += `**Chapter:** ${context.chapter}\n`;
    prompt += `**Difficulty:** ${context.difficulty}\n`;

    if (context.topic) {
      prompt += `**Specific Topic:** ${context.topic}\n`;
    }

    if (context.lessonContent) {
      prompt += `\n**Lesson Content:**\n${context.lessonContent}\n`;
    }

    prompt += `\nGenerate questions that test understanding of this content. Questions should be unique and not repetitive.`;

    return prompt;
  }

  private parseQuizResponse(
    content: string,
    subject: string,
    chapter: string,
    difficulty: DifficultyLevel,
    topic: string
  ): QuizQuestion[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const questions: QuizQuestion[] = [];

      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }

      parsed.forEach((item: any, index: number) => {
        if (item.question && item.options && Array.isArray(item.options) && item.options.length === 4) {
          questions.push({
            id: `${subject}-${chapter}-${Date.now()}-${index}`,
            question: item.question,
            options: item.options,
            correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
            explanation: item.explanation || 'No explanation provided',
            difficulty,
            topic,
            generatedAt: Date.now(),
          });
        }
      });

      // If we didn't get enough questions, fill with fallback
      while (questions.length < 5) {
        const fallback = this.getFallbackQuestions(subject, chapter, difficulty, topic);
        questions.push(...fallback.slice(0, 5 - questions.length));
      }

      return questions.slice(0, 5);
    } catch (error) {
      // Error parsing quiz response, returning fallback
      return this.getFallbackQuiz(subject, chapter, difficulty, 5);
    }
  }

  private getFallbackQuiz(
    subject: string,
    chapter: string,
    difficulty: DifficultyLevel,
    count: number
  ): QuizQuestion[] {
    return this.getFallbackQuestions(subject, chapter, difficulty, chapter).slice(0, count);
  }

  private getFallbackQuestions(
    subject: string,
    chapter: string,
    difficulty: DifficultyLevel,
    topic: string
  ): QuizQuestion[] {
    // Generate generic fallback questions
    const baseQuestions = [
      {
        question: `What is the main concept covered in ${chapter}?`,
        options: [
          'The first key concept',
          'The second key concept',
          'The third key concept',
          'The fourth key concept',
        ],
        correctAnswer: 0,
        explanation: `This question tests understanding of the main concept in ${chapter}.`,
      },
      {
        question: `Which of the following is a characteristic of ${topic}?`,
        options: ['Characteristic A', 'Characteristic B', 'Characteristic C', 'Characteristic D'],
        correctAnswer: 1,
        explanation: `This tests knowledge about ${topic} characteristics.`,
      },
      {
        question: `How would you apply the concept of ${topic} in a real-world scenario?`,
        options: ['Application A', 'Application B', 'Application C', 'Application D'],
        correctAnswer: 2,
        explanation: `This tests practical application of ${topic}.`,
      },
      {
        question: `What is the relationship between the concepts in ${chapter}?`,
        options: [
          'They are unrelated',
          'They are complementary',
          'They are contradictory',
          'They are sequential',
        ],
        correctAnswer: 1,
        explanation: `This tests understanding of concept relationships.`,
      },
      {
        question: `Which statement about ${topic} is correct?`,
        options: [
          'Statement A is correct',
          'Statement B is correct',
          'Statement C is correct',
          'Statement D is correct',
        ],
        correctAnswer: 0,
        explanation: `This tests factual knowledge about ${topic}.`,
      },
    ];

    return baseQuestions.map((q, index) => ({
      id: `${subject}-${chapter}-fallback-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty,
      topic,
      generatedAt: Date.now(),
    }));
  }

  getRecommendedDifficulty(userAccuracy: number): DifficultyLevel {
    if (userAccuracy >= 80) {
      return 'hard';
    } else if (userAccuracy >= 60) {
      return 'medium';
    } else {
      return 'easy';
    }
  }
}

export const aiQuizGeneratorService = AIQuizGeneratorService.getInstance();
