import { ContentRating } from '@/types/content';
import type { AgeGroup, SafetyFlag } from '@/types/content';

const RATING_ORDER: Record<ContentRating, number> = {
  [ContentRating.G]: 0,
  [ContentRating.PG]: 1,
  [ContentRating.PG13]: 2,
  [ContentRating.R]: 3,
  [ContentRating.NC17]: 4,
};

export function maxRating(a: ContentRating, b: ContentRating): ContentRating {
  return RATING_ORDER[a] >= RATING_ORDER[b] ? a : b;
}

export function getMaxAllowedRatingForAgeGroup(ageGroup: AgeGroup): ContentRating {
  return ageGroup === 'under12' ? ContentRating.PG : ContentRating.PG13;
}

export function isRatingAllowedForAgeGroup(ageGroup: AgeGroup, rating: ContentRating): boolean {
  return RATING_ORDER[rating] <= RATING_ORDER[getMaxAllowedRatingForAgeGroup(ageGroup)];
}

export function deriveRatingFromFlags(flags: SafetyFlag[]): ContentRating {
  if (flags.some((f) => f.category === 'sexual_minors')) return ContentRating.NC17;

  if (
    flags.some((f) =>
      (f.category === 'sexual' && f.severity === 'high') ||
      (f.category === 'self_harm' && f.severity === 'high') ||
      (f.category === 'hate' && f.severity === 'high')
    )
  ) {
    return ContentRating.R;
  }

  if (
    flags.some((f) =>
      f.category === 'violence' ||
      f.category === 'drugs' ||
      f.category === 'weapons' ||
      f.category === 'harassment' ||
      f.category === 'profanity'
    )
  ) {
    return ContentRating.PG13;
  }

  if (flags.some((f) => f.category === 'spam')) return ContentRating.PG;

  return ContentRating.G;
}
