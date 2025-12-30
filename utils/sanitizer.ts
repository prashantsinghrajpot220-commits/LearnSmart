export interface SanitizeTextOptions {
  maxLength?: number;
  preserveNewlines?: boolean;
}

const DEFAULT_MAX_LENGTH = 5000;

function stripAsciiControlChars(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);

    // ASCII control chars (except \t \n \r which we keep for readability)
    const isControl =
      (code >= 0 && code <= 8) ||
      code === 11 ||
      code === 12 ||
      (code >= 14 && code <= 31) ||
      code === 127;

    if (isControl) continue;
    out += input[i];
  }

  return out;
}

function hasAsciiControlChars(input: string): boolean {
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    const isControl = (code >= 0 && code <= 31) || code === 127;
    if (isControl) return true;
  }
  return false;
}

export function sanitizeText(input: string, options: SanitizeTextOptions = {}): string {
  const { maxLength = DEFAULT_MAX_LENGTH, preserveNewlines = true } = options;

  if (typeof input !== 'string') return '';

  let output = input;

  output = output.split('\u0000').join('');
  output = output.replace(/[\u200B-\u200D\uFEFF]/g, '');

  output = output.replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, '[removed]');
  output = output.replace(/<\s*iframe[\s\S]*?>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '[removed]');

  output = stripAsciiControlChars(output);

  if (!preserveNewlines) {
    output = output.replace(/\s+/g, ' ');
  }

  output = output.trim();

  if (output.length > maxLength) {
    output = output.slice(0, maxLength);
  }

  return output;
}

export function sanitizeTextForDisplay(input: string, options: SanitizeTextOptions = {}): string {
  return sanitizeText(input, { preserveNewlines: true, ...options });
}

export interface UrlSafetyOptions {
  allowlistDomains?: string[];
}

export function extractUrlsFromText(text: string): string[] {
  if (!text) return [];

  const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
  const matches = text.match(urlRegex);
  return matches ? Array.from(new Set(matches)) : [];
}

export function getHostnameFromUrl(url: string): string | null {
  try {
    const normalized = url.trim();
    const match = normalized.match(/^https?:\/\/(.*?)(?:\/[\s\S]*)?$/i);
    if (!match) return null;
    const hostPort = match[1];
    const host = hostPort.split(':')[0];
    return host.toLowerCase();
  } catch {
    return null;
  }
}

export function isSafeUrl(url: string, options: UrlSafetyOptions = {}): boolean {
  if (!url || typeof url !== 'string') return false;

  const normalized = url.trim();
  if (normalized.length > 2048) return false;

  const lower = normalized.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
    return false;
  }

  if (!/^https?:\/\//i.test(normalized)) return false;
  if (/\s/.test(normalized)) return false;
  if (hasAsciiControlChars(normalized)) return false;

  const hostname = getHostnameFromUrl(normalized);
  if (!hostname) return false;

  const { allowlistDomains } = options;
  if (allowlistDomains && allowlistDomains.length > 0) {
    return allowlistDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  }

  return true;
}

export function sanitizeUrl(url: string, options: UrlSafetyOptions = {}): string | null {
  const normalized = url?.trim();
  if (!normalized) return null;
  return isSafeUrl(normalized, options) ? normalized : null;
}

export function containsMaliciousMarkup(text: string): boolean {
  const lower = (text || '').toLowerCase();
  return (
    lower.includes('<script') ||
    lower.includes('javascript:') ||
    lower.includes('<iframe') ||
    lower.includes('onerror=') ||
    lower.includes('onload=')
  );
}
