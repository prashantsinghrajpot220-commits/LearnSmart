export type AgeGroup = 'under12' | '12plus';

export enum ContentType {
  Lesson = 'lesson',
  QuizQuestion = 'quiz_question',
  Book = 'book',
  Pathway = 'pathway',
  UserGeneratedText = 'user_generated_text',
  AIResponseText = 'ai_response_text',
}

export enum ContentRating {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  NC17 = 'NC-17',
}

export type SafetyCategory =
  | 'sexual'
  | 'sexual_minors'
  | 'violence'
  | 'self_harm'
  | 'hate'
  | 'harassment'
  | 'profanity'
  | 'drugs'
  | 'weapons'
  | 'spam'
  | 'malicious_link'
  | 'personal_data'
  | 'other';

export type SafetySeverity = 'low' | 'medium' | 'high';

export interface SafetyFlag {
  category: SafetyCategory;
  severity: SafetySeverity;
  matched?: string;
}

export type ValidationDecision = 'allow' | 'filter' | 'block' | 'quarantine';

export interface SafetyCheckResult {
  safe: boolean;
  rating: ContentRating;
  flags: SafetyFlag[];
  reasons: string[];
  provider: 'local' | 'remote' | 'none';
}

export interface ContentValidationContext {
  contentId: string;
  contentType: ContentType;
  ageGroup: AgeGroup;
  source?: string;
}

export interface ContentValidationResult {
  decision: ValidationDecision;
  rating: ContentRating;
  safe: boolean;
  flags: SafetyFlag[];
  reasons: string[];
  sanitizedText?: string;
  fallbackText?: string;
}

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface ModerationEvent {
  id: string;
  createdAt: string;
  contentId: string;
  contentType: ContentType;
  ageGroup: AgeGroup;
  decision: ValidationDecision;
  rating: ContentRating;
  flags: SafetyFlag[];
  reasons: string[];
  source?: string;
  status: ModerationStatus;
}
