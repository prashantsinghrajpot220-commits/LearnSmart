# Content Safety Validation (Phase 6E)

This project includes a lightweight content safety system that:

- Validates and sanitizes text content before displaying it
- Applies **age-appropriate filtering** (Under 12 vs 12+)
- Flags and quarantines suspicious content
- Stores **moderation logs** locally (AsyncStorage)
- Supports an optional **remote AI moderation provider** (graceful fallback to local checks)

> Note: LearnSmart is primarily a client app. Remote AI moderation should be implemented via a server endpoint (e.g. Cloud Function) so no secret API key is bundled into the app.

## Overview

### Core Modules

- `types/content.ts`
  - Shared enums/types: `ContentType`, `ContentRating`, moderation event types.

- `utils/sanitizer.ts`
  - Defensive text sanitization: removes control chars, strips common script/iframe injection payloads.
  - URL extraction + safety checks (blocks `javascript:`, `data:`, non-http(s), whitespace/control chars).

- `utils/contentRating.ts`
  - Rating helpers (`G`, `PG`, `PG-13`, ...)
  - Age gating rules:
    - `under12` → max rating `PG`
    - `12plus` → max rating `PG-13`

- `services/SafetyChecker.ts`
  - Local heuristic safety checks (keyword/pattern-based) for:
    - sexual content
    - violence/self-harm
    - hate/harassment
    - profanity
    - malicious/spam links
  - Optional remote check (see below) with retry + timeout.

- `services/ContentValidator.ts`
  - High-level validators for:
    - lessons
    - quiz questions
    - pathways
    - books/resources
  - Quarantine + moderation event logging.

## Age Filtering

The app distinguishes between:

- **Under 12** (`ageGroup = under12`): only `G` and `PG` content is displayed.
- **12+** (`ageGroup = 12plus`): `PG-13` content is allowed.

Anything flagged as **unsafe** (high severity) is blocked regardless of age.

## Moderation Flow

### Flagging

When unsafe content is detected, `ContentValidator` can:

- write a moderation event to local storage
- automatically quarantine the content id

### Quarantine

Quarantined content ids are stored in AsyncStorage:

- `@learnsmart/moderation_quarantine`

Status values:

- `pending` (quarantined)
- `approved`
- `rejected`

### Logs

Moderation events are stored in AsyncStorage:

- `@learnsmart/moderation_events`

You can inspect them in development by calling:

```ts
import { ContentValidator } from '@/services/ContentValidator';

const events = await ContentValidator.getModerationEvents();
console.log(events);
```

## Optional AI / Remote Safety Checks

`SafetyChecker` supports a remote moderation endpoint:

- `EXPO_PUBLIC_CONTENT_SAFETY_ENDPOINT`

This endpoint should be **your own server**.

### Expected Request

```json
{
  "text": "...",
  "context": {
    "contentId": "...",
    "contentType": "lesson|quiz_question|book|pathway|...",
    "ageGroup": "under12|12plus"
  }
}
```

### Expected Response (example)

```json
{
  "safe": true,
  "rating": "PG",
  "flags": [{ "category": "profanity", "severity": "medium" }],
  "reasons": ["profanity:medium"]
}
```

If the remote service fails, the app automatically falls back to local checks.

## UI Guardrails

Content safety validation is applied before rendering:

- lessons (`components/LessonView.tsx`)
- quiz questions (`components/QuizModal.tsx` + `components/QuizCard.tsx`)
- books/resources (`components/BooksGrid.tsx`)
- pathways (`components/PathwaysTab.tsx`)

When content is blocked/filtered, the UI shows safe fallback messaging instead of crashing.
