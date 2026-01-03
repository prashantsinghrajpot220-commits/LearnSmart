export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  photo?: string;
  createdAt: string;
  updatedAt: string;
  answerCount: number;
  viewCount: number;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  text: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  downvoteCount: number;
  helpfulCount: number;
  isAIGenerated?: boolean;
}

export type VoteType = 'upvote' | 'downvote';

export interface Vote {
  id: string;
  answerId: string;
  userId: string;
  voteType: VoteType;
  createdAt: string;
}
