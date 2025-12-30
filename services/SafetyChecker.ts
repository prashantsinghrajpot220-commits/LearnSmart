import type { ContentValidationContext, SafetyCheckResult, SafetyFlag } from '@/types/content';
import { ContentRating } from '@/types/content';
import { deriveRatingFromFlags } from '@/utils/contentRating';
import { extractUrlsFromText, getHostnameFromUrl, isSafeUrl } from '@/utils/sanitizer';

export interface SafetyCheckerOptions {
  useRemote?: boolean;
  timeoutMs?: number;
  maxRetries?: number;
}

const REMOTE_SAFETY_ENDPOINT = process.env.EXPO_PUBLIC_CONTENT_SAFETY_ENDPOINT || '';

const DEFAULT_OPTIONS: Required<SafetyCheckerOptions> = {
  useRemote: Boolean(REMOTE_SAFETY_ENDPOINT),
  timeoutMs: 7000,
  maxRetries: 2,
};

function flag(category: SafetyFlag['category'], severity: SafetyFlag['severity'], matched?: string): SafetyFlag {
  return { category, severity, matched };
}

const PROFANITY = [
  /\b(fuck|shit|bitch|asshole|dick|pussy)\b/i,
  /\b(bastard|motherfucker)\b/i,
];

const SEXUAL = [
  /\b(porn|pornography|xxx)\b/i,
  /\b(nude|nudes|sex\s*video)\b/i,
];

const SEXUAL_MINORS = [/\b(child\s*porn|cp\b)\b/i];

const SELF_HARM = [/\b(suicide|kill\s*yourself|self\s*harm|cut\s*myself)\b/i];

const VIOLENCE = [/\b(murder|shoot(ing)?|stab|bomb)\b/i];

const HATE = [/\b(nazi)\b/i];

const PERSONAL_DATA = [
  /\b(phone\s*number|email\s*address|home\s*address)\b/i,
  /\b(credit\s*card|ssn|social\s*security)\b/i,
];

function localFlagsForText(text: string): SafetyFlag[] {
  const flags: SafetyFlag[] = [];

  const scan = (patterns: RegExp[], makeFlag: () => SafetyFlag) => {
    for (const p of patterns) {
      const match = text.match(p);
      if (match) flags.push({ ...makeFlag(), matched: match[0] });
    }
  };

  scan(SEXUAL_MINORS, () => flag('sexual_minors', 'high'));
  scan(SEXUAL, () => flag('sexual', 'high'));
  scan(SELF_HARM, () => flag('self_harm', 'high'));
  scan(VIOLENCE, () => flag('violence', 'high'));
  scan(HATE, () => flag('hate', 'high'));
  scan(PERSONAL_DATA, () => flag('personal_data', 'medium'));
  scan(PROFANITY, () => flag('profanity', 'medium'));

  const urls = extractUrlsFromText(text);
  const blockedDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];

  for (const url of urls) {
    if (!isSafeUrl(url)) {
      flags.push(flag('malicious_link', 'high', url));
      continue;
    }

    const host = getHostnameFromUrl(url);
    if (host && blockedDomains.some((d) => host === d || host.endsWith(`.${d}`))) {
      flags.push(flag('malicious_link', 'high', url));
      continue;
    }

    if (url.toLowerCase().startsWith('http://')) {
      flags.push(flag('malicious_link', 'medium', url));
    }
  }

  if (urls.length >= 3) {
    flags.push(flag('spam', 'medium', `${urls.length}_links`));
  }

  return flags;
}

function localSafetyCheck(text: string): SafetyCheckResult {
  const flags = localFlagsForText(text);
  const rating = deriveRatingFromFlags(flags);

  const unsafeHigh = flags.some((f) => f.severity === 'high');
  const safe = !unsafeHigh;

  const reasons = flags.map((f) => `${f.category}:${f.severity}`);

  return {
    safe,
    rating,
    flags,
    reasons,
    provider: 'local',
  };
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  maxRetries: number
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      lastError = err;
      const delay = 300 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Remote safety check failed');
}

async function remoteSafetyCheck(text: string, context: ContentValidationContext, options: Required<SafetyCheckerOptions>): Promise<SafetyCheckResult> {
  if (!REMOTE_SAFETY_ENDPOINT) {
    return { safe: true, rating: ContentRating.G, flags: [], reasons: [], provider: 'none' };
  }

  const res = await fetchWithRetry(
    REMOTE_SAFETY_ENDPOINT,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, context }),
    },
    options.timeoutMs,
    options.maxRetries
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Remote safety check error: ${res.status} ${errText}`);
  }

  const data = (await res.json()) as Partial<SafetyCheckResult>;

  return {
    safe: Boolean(data.safe),
    rating: (data.rating as ContentRating) || ContentRating.G,
    flags: Array.isArray(data.flags) ? (data.flags as SafetyFlag[]) : [],
    reasons: Array.isArray(data.reasons) ? (data.reasons as string[]) : [],
    provider: 'remote',
  };
}

export class SafetyChecker {
  static checkTextSafetySync(text: string): SafetyCheckResult {
    return localSafetyCheck(text);
  }

  static async checkTextSafety(text: string, context: ContentValidationContext, options: SafetyCheckerOptions = {}): Promise<SafetyCheckResult> {
    const merged: Required<SafetyCheckerOptions> = { ...DEFAULT_OPTIONS, ...options };

    const local = localSafetyCheck(text);

    if (!merged.useRemote) {
      return local;
    }

    try {
      const remote = await remoteSafetyCheck(text, context, merged);
      const flags = [...local.flags, ...remote.flags];
      const rating = deriveRatingFromFlags(flags);
      const safe = local.safe && remote.safe && !flags.some((f) => f.category === 'malicious_link' && f.severity === 'high');

      return {
        safe,
        rating,
        flags,
        reasons: [...new Set([...local.reasons, ...remote.reasons])],
        provider: 'remote',
      };
    } catch (err) {
      console.warn('Remote safety check unavailable, falling back to local checks:', err);
      return local;
    }
  }
}
