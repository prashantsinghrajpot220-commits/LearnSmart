import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  ContentValidationContext,
  ContentValidationResult,
  ModerationEvent,
  ValidationDecision,
} from '@/types/content';
import { ContentRating, ContentType } from '@/types/content';
import { isRatingAllowedForAgeGroup, maxRating } from '@/utils/contentRating';
import { sanitizeText, sanitizeTextForDisplay, sanitizeUrl } from '@/utils/sanitizer';
import { SafetyChecker } from '@/services/SafetyChecker';
import { DiagramData } from '@/constants/curriculum';

const STORAGE_KEYS = {
  EVENTS: '@learnsmart/moderation_events',
  QUARANTINE: '@learnsmart/moderation_quarantine',
};

type QuarantineMap = Record<string, { status: 'pending' | 'approved' | 'rejected'; updatedAt: string; reasons: string[] }>;

let quarantineCache: QuarantineMap | null = null;
let initPromise: Promise<void> | null = null;

async function ensureInitialized(): Promise<void> {
  if (quarantineCache) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.QUARANTINE);
      quarantineCache = raw ? (JSON.parse(raw) as QuarantineMap) : {};
    } catch (err) {
      console.warn('Failed to load quarantine cache:', err);
      quarantineCache = {};
    }
  })();

  return initPromise;
}

function nowIso(): string {
  return new Date().toISOString();
}

function decisionToStatus(decision: ValidationDecision): ModerationEvent['status'] {
  if (decision === 'quarantine') return 'pending';
  return 'approved';
}

async function appendModerationEvent(event: ModerationEvent): Promise<void> {
  try {
    const existingRaw = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
    const existing: ModerationEvent[] = existingRaw ? (JSON.parse(existingRaw) as ModerationEvent[]) : [];

    const next = [event, ...existing].slice(0, 200);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(next));
  } catch (err) {
    console.warn('Failed to append moderation event:', err);
  }
}

async function updateQuarantine(contentId: string, update: QuarantineMap[string]): Promise<void> {
  await ensureInitialized();
  quarantineCache = quarantineCache ?? {};
  quarantineCache[contentId] = update;

  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QUARANTINE, JSON.stringify(quarantineCache));
  } catch (err) {
    console.warn('Failed to update quarantine store:', err);
  }
}

export interface ValidateTextInput {
  text: string;
  context: ContentValidationContext;
}

export interface ValidatedTextOutput {
  sanitizedText: string;
  result: ContentValidationResult;
}

export interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
  imageUrl?: string;
  diagramData?: DiagramData;
}

export interface QuizQuestionContent {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BookContent {
  id: string;
  title: string;
  author: string;
  description: string;
  amazonUrl?: string;
  asin?: string;
  isbn?: string;
}

export interface PathwayContent {
  id: string;
  title: string;
  description: string;
}

export class ContentValidator {
  static async getModerationEvents(): Promise<ModerationEvent[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      return raw ? (JSON.parse(raw) as ModerationEvent[]) : [];
    } catch {
      return [];
    }
  }

  static async isQuarantined(contentId: string): Promise<boolean> {
    await ensureInitialized();
    return Boolean(quarantineCache?.[contentId] && quarantineCache[contentId].status === 'pending');
  }

  static isQuarantinedSync(contentId: string): boolean {
    return Boolean(quarantineCache?.[contentId] && quarantineCache[contentId].status === 'pending');
  }

  static async approveContent(contentId: string): Promise<void> {
    await updateQuarantine(contentId, { status: 'approved', updatedAt: nowIso(), reasons: [] });
  }

  static async rejectContent(contentId: string, reasons: string[] = []): Promise<void> {
    await updateQuarantine(contentId, { status: 'rejected', updatedAt: nowIso(), reasons });
  }

  static async quarantineContent(contentId: string, reasons: string[]): Promise<void> {
    await updateQuarantine(contentId, { status: 'pending', updatedAt: nowIso(), reasons });
  }

  static validateTextSync({ text, context }: ValidateTextInput): ValidatedTextOutput {
    const sanitizedText = sanitizeTextForDisplay(text);
    const safety = SafetyChecker.checkTextSafetySync(sanitizedText);

    const rating = safety.rating;
    const ageAllowed = isRatingAllowedForAgeGroup(context.ageGroup, rating);

    let decision: ValidationDecision = 'allow';
    let safe = safety.safe;
    const reasons: string[] = [...safety.reasons];

    if (!safe) {
      decision = 'block';
    } else if (!ageAllowed) {
      decision = 'filter';
    }

    const result: ContentValidationResult = {
      decision,
      rating,
      safe,
      flags: safety.flags,
      reasons,
      sanitizedText,
      fallbackText: decision === 'filter' || decision === 'block' ? 'This content is not available for your age group.' : undefined,
    };

    return { sanitizedText, result };
  }

  static async validateText({ text, context }: ValidateTextInput): Promise<ValidatedTextOutput> {
    await ensureInitialized();

    const sanitizedText = sanitizeText(text);

    if (this.isQuarantinedSync(context.contentId)) {
      const result: ContentValidationResult = {
        decision: 'quarantine',
        rating: ContentRating.R,
        safe: false,
        flags: [],
        reasons: ['quarantined'],
        sanitizedText: '',
        fallbackText: 'This content is temporarily unavailable while we review it.',
      };

      return { sanitizedText: '', result };
    }

    const safety = await SafetyChecker.checkTextSafety(sanitizedText, context);
    const ageAllowed = isRatingAllowedForAgeGroup(context.ageGroup, safety.rating);

    let decision: ValidationDecision = 'allow';

    if (!safety.safe) {
      decision = 'quarantine';
    } else if (!ageAllowed) {
      decision = 'filter';
    }

    const result: ContentValidationResult = {
      decision,
      rating: safety.rating,
      safe: safety.safe,
      flags: safety.flags,
      reasons: safety.reasons,
      sanitizedText,
      fallbackText: decision === 'filter'
        ? 'Some content was hidden because it is not appropriate for your age group.'
        : decision === 'quarantine'
          ? 'This content is temporarily unavailable while we review it.'
          : undefined,
    };

    if (decision !== 'allow') {
      const event: ModerationEvent = {
        id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: nowIso(),
        contentId: context.contentId,
        contentType: context.contentType,
        ageGroup: context.ageGroup,
        decision,
        rating: result.rating,
        flags: result.flags,
        reasons: result.reasons,
        source: context.source,
        status: decisionToStatus(decision),
      };

      await appendModerationEvent(event);

      if (decision === 'quarantine') {
        await this.quarantineContent(context.contentId, result.reasons);
      }
    }

    return { sanitizedText, result };
  }

  static validateLessonContentSync(lesson: LessonContent, context: Omit<ContentValidationContext, 'contentType'>): {
    content: LessonContent | null;
    rating: ContentRating;
    decision: ValidationDecision;
  } {
    let rating: ContentRating = ContentRating.G;
    let decision: ValidationDecision = 'allow';

    const titleRes = this.validateTextSync({
      text: lesson.title,
      context: { ...context, contentType: ContentType.Lesson },
    });
    rating = maxRating(rating, titleRes.result.rating);

    if (titleRes.result.decision !== 'allow') {
      return {
        content: null,
        rating,
        decision: titleRes.result.decision === 'block' ? 'block' : 'filter',
      };
    }

    const bulletPoints = lesson.bulletPoints
      .map((bp) =>
        this.validateTextSync({
          text: bp,
          context: { ...context, contentType: ContentType.Lesson },
        })
      )
      .filter((r) => r.result.decision === 'allow')
      .map((r) => r.sanitizedText);

    const paragraphs = lesson.paragraphs
      .map((p) =>
        this.validateTextSync({
          text: p,
          context: { ...context, contentType: ContentType.Lesson },
        })
      )
      .filter((r) => r.result.decision === 'allow')
      .map((r) => r.sanitizedText);



    const sanitized: LessonContent = {
      title: titleRes.sanitizedText,
      icon: sanitizeTextForDisplay(lesson.icon, { maxLength: 8, preserveNewlines: false }),
      bulletPoints,
      paragraphs,
      imageUrl: lesson.imageUrl,
      diagramData: lesson.diagramData,
    };

    if (bulletPoints.length === 0 && paragraphs.length === 0) {
      return { content: null, rating, decision: 'filter' };
    }

    return { content: sanitized, rating, decision };
  }

  static async validateQuizQuestions(
    questions: QuizQuestionContent[],
    context: Omit<ContentValidationContext, 'contentType'>
  ): Promise<QuizQuestionContent[]> {
    await ensureInitialized();

    const safeQuestions: QuizQuestionContent[] = [];

    for (const q of questions) {
      const baseCtx: ContentValidationContext = {
        ...context,
        contentId: `${context.contentId}:${q.id}`,
        contentType: ContentType.QuizQuestion,
      };

      if (this.isQuarantinedSync(baseCtx.contentId)) continue;

      const questionRes = await this.validateText({ text: q.question, context: baseCtx });
      if (questionRes.result.decision !== 'allow') continue;

      const explanationRes = await this.validateText({ text: q.explanation, context: baseCtx });
      if (explanationRes.result.decision !== 'allow') continue;

      const options: string[] = [];
      let blockedOption = false;

      for (const opt of q.options) {
        const optRes = await this.validateText({ text: opt, context: baseCtx });
        if (optRes.result.decision !== 'allow') {
          blockedOption = true;
          break;
        }
        options.push(optRes.sanitizedText);
      }

      if (blockedOption) continue;

      safeQuestions.push({
        ...q,
        question: questionRes.sanitizedText,
        explanation: explanationRes.sanitizedText,
        options,
      });
    }

    return safeQuestions;
  }

  static validateBooksSync<T extends BookContent>(
    books: T[],
    context: Omit<ContentValidationContext, 'contentType'>
  ): T[] {
    return books
      .map((b) => {
        const baseCtx: ContentValidationContext = {
          ...context,
          contentId: `${context.contentId}:${b.id}`,
          contentType: ContentType.Book,
        };

        const titleRes = this.validateTextSync({ text: b.title, context: baseCtx });
        const authorRes = this.validateTextSync({ text: b.author, context: baseCtx });
        const descRes = this.validateTextSync({ text: b.description, context: baseCtx });

        const amazonUrl = b.amazonUrl
          ? sanitizeUrl(b.amazonUrl, {
              allowlistDomains: [
                'amazon.com',
                'amazon.co.uk',
                'amazon.ca',
                'amazon.de',
                'amazon.fr',
                'amazon.es',
                'amazon.it',
                'amazon.co.jp',
                'amazon.in',
                'amazon.com.au',
              ],
            })
          : null;

        const combinedDecision: ValidationDecision = [titleRes, authorRes, descRes].some((r) => r.result.decision === 'block')
          ? 'block'
          : [titleRes, authorRes, descRes].some((r) => r.result.decision === 'filter')
            ? 'filter'
            : 'allow';

        const hasProductIdentifier = Boolean(b.asin || b.isbn);

        if (combinedDecision !== 'allow') return null;
        if (!amazonUrl && !hasProductIdentifier) return null;

        return {
          ...b,
          title: titleRes.sanitizedText,
          author: authorRes.sanitizedText,
          description: descRes.sanitizedText,
          amazonUrl: amazonUrl ?? undefined,
        } as T;
      })
      .filter((b): b is T => Boolean(b));
  }

  static validatePathwaysSync<T extends PathwayContent>(
    pathways: T[],
    context: Omit<ContentValidationContext, 'contentType'>
  ): T[] {
    return pathways
      .map((p) => {
        const baseCtx: ContentValidationContext = {
          ...context,
          contentId: `${context.contentId}:${p.id}`,
          contentType: ContentType.Pathway,
        };
        const titleRes = this.validateTextSync({ text: p.title, context: baseCtx });
        const descRes = this.validateTextSync({ text: p.description, context: baseCtx });

        const decision: ValidationDecision = titleRes.result.decision === 'block' || descRes.result.decision === 'block'
          ? 'block'
          : titleRes.result.decision === 'filter' || descRes.result.decision === 'filter'
            ? 'filter'
            : 'allow';

        if (decision !== 'allow') return null;

        return {
          ...p,
          title: titleRes.sanitizedText,
          description: descRes.sanitizedText,
        } as T;
      })
      .filter((p): p is T => Boolean(p));
  }
}
