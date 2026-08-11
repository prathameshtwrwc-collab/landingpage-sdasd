# Plan — Multilingual TTS Accessibility System

## Context

Add a centralized, multilingual, provider-agnostic Text-to-Speech (TTS) accessibility layer to the existing Next.js website. The active i18n locale is the single source of truth for TTS language/voice selection. Primary target is functional accessibility: Login, forms, the assessment questionnaire, validation/error/success messages, and instructions. The landing page is NOT to be redesigned or unnecessarily modified. The existing i18n implementation must not be changed.

## Verified facts (from codebase + FreeTTS docs)

- **Framework:** Next.js 16.2.6 (App Router, Turbopack), React 19.2.6, TypeScript 5.9.3, Tailwind CSS 4, `next-intl` 4.13.5, Clerk auth, Supabase + Drizzle, Lenis smooth scroll, `lucide-react`, framer-motion.
- **i18n:** Cookie + localStorage based (`app_locale`), no URL prefix. Server reads the cookie in `src/app/layout.tsx` and passes `locale` into `<ClientLayout locale={locale}>` → `I18nProvider initialLocale`. Client components use `useAppLocale()` (`src/components/i18n/I18nProvider.tsx`) and `useTranslations()`.
- **Locale inventory (28 unique keys, unchanged — do NOT modify):** en, es, fr, de, ru, zh, zh-tw, ja, it, tr, ar, bn, fi, he, el, ms, pt, ur, hi, mr, gu, ta, te, kn, pa, ml, or, ur-in. (`en` and `bn` appear in both the international and indian groups with the same code.)
- **Message files:** `messages/<locale>.json`, namespaces include `nav, hero, floating, switcher, footer, statement, chronoIntro, chronoOpt, pillars, betterDays, whySleep, sleepCycles, disorders, warningSigns, sleepFacts, guidance, faq, donate, consult, assessment`. `getMessages()` deep-merges `en` base with the locale override, so new keys added only to `en.json` fall back to English for every locale.
- **Questionnaire:** `src/components/assessment/AssessmentModal.tsx` (1900+ lines) — personal-details form step → questions step (questions/options fetched from Supabase, translated client-side via `src/i18n/assessment.ts` `translateAssessment(locale, questions)`) → result step. **TTS speaks the exact `translateAssessment()` output — no independent translation/reinterpretation.**
- **Login:** `src/app/login/page.tsx` + `src/components/auth/LoginCard.tsx` (email → password → not_found steps). `src/app/sign-in/page.tsx` redirects to `/login`. No separate registration/forgot-password pages.
- **Forms:** `src/components/consult/ConsultModal.tsx`, dashboard profile/settings — deferred to later passes.
- **API conventions:** Route handlers at `src/app/api/<name>/route.ts`, `NextResponse.json`, no auth on public routes. `src/proxy.ts` (Clerk middleware) only protects `/admin*` and `/api/admin*` — **`/api/tts` will be public**; it must carry its own abuse protection.
- **Existing cache utility:** `src/lib/client-cache.ts` (`cachedFetch`, dedupe, TTL) — pattern to mirror for the TTS client cache, not reused directly.
- **No test framework** in the repo (no vitest/jest). Validation = `npx tsc --noEmit`, `npm run build`, and a manual dev checklist.

## FreeTTS API (verified 2026-08-12; treat limits as configuration, not permanent facts)

- `POST https://freetts.org/api/tts` body `{ text, voice, rate, pitch }` → `{ file_id }`.
- `GET https://freetts.org/api/audio/{file_id}` → MP3 (`audio/mpeg`), valid 1 hour.
- `GET https://freetts.org/api/voices` → `[{ ShortName, Gender, Locale, LocaleName }]`.
- Free tier (documented 2026-08-12): **1,000 chars/request**, **20 requests/min/IP**, 429 on limit, files temporary, MP3 48kHz, **no CORS headers** (must proxy server-side), **audio watermark**. All of these live in `tts-config` as env-driven values, documented in `docs/TTS.md` — provider limits may change.
- Rate/pitch default: `+0%` / `+0Hz` (range -50%..+100%, -20Hz..+20Hz).

### ⚠️ Commercial licensing (flag — confirmed)

FreeTTS Terms §17 + developer FAQ: **the free tier is personal/non-commercial only and adds an audio watermark. Commercial use requires PRO ($19/mo) or Creator.** This is a production/commercial site, so the free tier must NOT be the production provider. Keep the provider-agnostic architecture and the FreeTTS provider as the dev/staging default; production switches providers via `TTS_PROVIDER` env through the provider abstraction. Document this clearly in `docs/TTS.md`.

## Decisions (confirmed with user)

1. **Licensing:** Provider-agnostic core + FreeTTS default (dev/staging only). Production uses a commercial provider via env config.
2. **Global toggle placement:** Small speaker-icon toggle in the navbar next to the LanguageSwitcher (desktop + mobile), same visual language; also on the login page header area.
3. **First-pass scope:** TTS core + global toggle + reusable TTSButton + Login (`LoginCard`) + Assessment (`AssessmentModal`). ConsultModal and dashboard forms deferred.
4. **Manual vs automatic speech:** Global Voice Assistance OFF disables only AUTOMATIC speech (field focus, question auto-read, error auto-announce). Explicit `TTSButton` clicks ALWAYS speak, regardless of the global toggle.
5. **Voice resolution:** Client sends only `text, locale, type`. The server resolves the voice from the centralized verified voice registry. No client-controlled `voice` parameter in the production contract (dev-only override allowed, see below).
6. **pa/or:** Do NOT silently use Hindi. Exact voice → compatible verified fallback → graceful "voice unavailable for this language" state. Punjabi and Odia have no verified FreeTTS voice and no verified compatible fallback → they are marked UNAVAILABLE (button disabled with localized label; auto-read skips silently).

## UX constraints (final — apply to all integration code)

1. **No bulk auto-reading.** Automatic TTS never reads an entire page, form, modal, heading set, or all options when something opens. Automatic speech announces only concise, contextually important information (the current question, a changed validation error, a step-level result).
2. **Interaction gate.** Automatic speech never fires before the user has meaningfully interacted with the page. The manager's `hasInteracted` flag (set once on `pointerdown`/`keydown`) gates all `automatic: true` speech in addition to browser autoplay protection. Explicit TTSButton clicks are always allowed and are themselves user gestures.
3. **Assessment speech rules:**
   - Automatically read ONLY the current question, and only when the question index actually changes.
   - Never auto-read options.
   - Each option gets its own manual `<TTSButton>`.
   - Never re-read a question because of a re-render, focus change, or unrelated state update. The integration tracks the last auto-spoken question index (ref keyed by question `id` + step) and only fires on a real change.
4. **Login speech rules:**
   - Concise field guidance is spoken on the first meaningful focus of a field when Voice Assistance is enabled; it is not spoken on every focus/blur cycle (per-field `spokenRef`).
   - Never speak individual keystrokes or the user's entered email/password (no `onChange` speech; focus/error speech uses static localized phrasing, not field values).
   - Validation errors may be auto-spoken once per distinct error change (speak when the error string actually transitions, not on every render).
5. **Sensitive/user-entered content:**
   - Passwords are never logged, persisted, server-cached, or sent for TTS.
   - The user's entered email, name, or free-text answers are never auto-spoken; if a manual control ever exposes them, it must be explicitly user-initiated and the value must not be cached (`userContent: true` skips server and client caches).
   - `userContent` remains uncached as specified.
6. **Punjabi/Odia:** no Hindi audio fallback; when no verified voice exists, show the localized `voiceUnavailable` state and never produce misleading audio. Keep the resolution provider-specific (voice registry + provider config), so a future production provider with pa/or voices only requires updating the registry/config — no component changes.
7. **TTS is strictly additive:** if `/api/tts` fails, times out, returns 429, or the provider is unavailable, normal functionality is completely unaffected. TTS errors never block form submission, questionnaire navigation, login, or any other app behavior (all speak paths are fire-and-forget).
8. **Provider boundary:** `LoginCard`, `AssessmentModal`, `TTSButton`, and `VoiceAssistanceToggle` never import a concrete provider or FreeTTS specifics; they only use `useTTS()`. Changing the production provider requires only env config + registry/provider files.
9. **Language normalization:** `bn`/`bn` display variants are one TTS language; `ur`/`ur-in` are one TTS language. i18n locale keys are untouched.
10. **Scope discipline:** no landing-page design changes and no TTS controls scattered across the landing page in this first pass.

## TTS language normalization (new layer)

i18n locale → normalized TTS language → verified voice. Multiple i18n display variants that share one underlying spoken language normalize to one TTS language/voice. Locale keys themselves are unchanged.

| Normalized TTS language | i18n locales | Voice ShortName |
|---|---|---|
| `bn` (Bengali/Bangla) | bn | bn-IN-TanishaaNeural |
| `ur` (Urdu) | ur, ur-in | ur-IN-GulNeural |

`zh` and `zh-tw` remain distinct (different script/voice). All other locales normalize 1:1.

## Verified voice matrix (all ShortNames verified against `GET /api/voices`, 2026-08-12)

| i18n locale | Display name | Voice ShortName | Voice Locale | Exact match | Fallback | Appropriate |
|---|---|---|---|---|---|---|
| en | English | en-US-JennyNeural | en-US | Yes | — | Yes |
| es | Spanish | es-ES-ElviraNeural | es-ES | Yes | — | Yes |
| fr | French | fr-FR-DeniseNeural | fr-FR | Yes | — | Yes |
| de | German | de-DE-KatjaNeural | de-DE | Yes | — | Yes |
| ru | Russian | ru-RU-SvetlanaNeural | ru-RU | Yes | — | Yes |
| zh | Chinese (Simplified) | zh-CN-XiaoxiaoNeural | zh-CN | Yes | — | Yes |
| zh-tw | Chinese (Traditional) | zh-TW-HsiaoChenNeural | zh-TW | Yes | — | Yes |
| ja | Japanese | ja-JP-NanamiNeural | ja-JP | Yes | — | Yes |
| it | Italian | it-IT-ElsaNeural | it-IT | Yes | — | Yes |
| tr | Turkish | tr-TR-EmelNeural | tr-TR | Yes | — | Yes |
| ar | Arabic | ar-SA-ZariyahNeural | ar-SA | Yes | — | Yes (MSA) |
| bn | Bangla/Bengali | bn-IN-TanishaaNeural | bn-IN | Yes | — | Yes |
| fi | Finnish | fi-FI-NooraNeural | fi-FI | Yes | — | Yes |
| he | Hebrew | he-IL-HilaNeural | he-IL | Yes | — | Yes |
| el | Greek | el-GR-AthinaNeural | el-GR | Yes | — | Yes |
| ms | Malay | ms-MY-YasminNeural | ms-MY | Yes | — | Yes |
| pt | Portuguese | pt-PT-RaquelNeural | pt-PT | Yes | — | Yes |
| ur | Urdu (Pakistan) | ur-IN-GulNeural | ur-IN | Yes (normalized) | — | Yes |
| ur-in | Urdu (India) | ur-IN-GulNeural | ur-IN | Yes (normalized) | — | Yes |
| hi | Hindi | hi-IN-SwaraNeural | hi-IN | Yes | — | Yes |
| mr | Marathi | mr-IN-AarohiNeural | mr-IN | Yes | — | Yes |
| gu | Gujarati | gu-IN-DhwaniNeural | gu-IN | Yes | — | Yes |
| ta | Tamil | ta-IN-PallaviNeural | ta-IN | Yes | — | Yes |
| te | Telugu | te-IN-ShrutiNeural | te-IN | Yes | — | Yes |
| kn | Kannada | kn-IN-SapnaNeural | kn-IN | Yes | — | Yes |
| ml | Malayalam | ml-IN-SobhanaNeural | ml-IN | Yes | — | Yes |
| pa | Punjabi | — | — | No | None verified | **UNAVAILABLE** |
| or | Odia | — | — | No | None verified | **UNAVAILABLE** |

No invented voice IDs. `pa`/`or` → `TTS_VOICE_UNAVAILABLE` state.

## Architecture

```
Browser (components, useTTS)
   │  speak({text, locale?, type, automatic?})
   ▼
TTSProvider (client manager: single Audio, priority, dedupe, client cache, locale sync)
   │  POST /api/tts {text, locale, type}
   ▼
/api/tts route (validate, normalize, throttle, best-effort server cache, resolve voice, error mapping)
   │  TTSProvider interface (synthesize())
   ▼
FreeTTSProvider (POST /tts → file_id → GET /audio/{file_id} → MP3 buffer)
   │
   ▼
FreeTTS REST API
```

- **Client never calls FreeTTS directly** (no CORS). Everything goes through `/api/tts`.
- **Locale is the source of truth:** TTSProvider reads `locale` from `useAppLocale()`. On locale change (existing `setLocale` does `window.location.reload()`), speech stops naturally on reload; `stop()` is also called in a `usePathname` effect and on unmount.
- **No language detection.**
- **Provider swap:** `TTS_PROVIDER` env selects the provider module. App components only ever use `useTTS()`.

## Files to create

1. `src/lib/tts/tts-types.ts` — `SpeechType` (`question|option|error|warning|success|instruction|label|helper|confirmation|page`), `SpeechPriority`, `SpeakOptions` (`{ text, type?, rate?, pitch?, userContent?, automatic? }`), `TTSResult`, `TTSProvider` interface (`synthesize(input): Promise<TTSResult>`). No `voice` in the production `SpeakOptions` — voice is server-resolved.
2. `src/lib/tts/tts-config.ts` — env-driven config (treated as configuration, not permanent facts): `TTS_PROVIDER` (default `freetts`), `FREETTS_BASE_URL` (default `https://freetts.org`), `FREETTS_MAX_CHARS` (default `1000`), `FREETTS_TIMEOUT_MS` (default `8000`), `FREETTS_RATE` (`+0%`), `FREETTS_PITCH` (`+0Hz`), optional `FREETTS_API_KEY` (reserved for PRO), `TTS_ALLOW_VOICE_OVERRIDE` (dev-only, default `false`). Export `resolveProvider()`, `maxChars`, `ttsTimeout`.
3. `src/lib/tts/voice-registry.ts` — `normalizeLanguage(locale)` (bn→bn, ur/ur-in→ur, else identity), `VOICE_BY_LANGUAGE` (from the verified matrix), `resolveVoice(locale)` → `{ status: "exact", voice } | { status: "unavailable" }`. **No Hindi fallback for pa/or.** Global fallback voice `en-US-JennyNeural` used only when the incoming locale is invalid.
4. `src/lib/tts/providers/freetts-provider.ts` — `FreeTTSProvider implements TTSProvider`: POST `${base}/api/tts`, parse `file_id`, GET `${base}/api/audio/${file_id}`, return `{ audioBuffer, requestId }`. Map 429 → `TTS_RATE_LIMITED`, other failures → `TTS_UNAVAILABLE`. Timeout via `AbortSignal.timeout(ttsTimeout)`. No voices hardcoded here.
5. `src/lib/tts/providers/index.ts` — `getTTSProvider()` selected by `TTS_PROVIDER` (only `freetts` implemented; extensible).
6. `src/lib/tts/text-utils.ts` — `normalizeForSpeech(text)` (strip HTML tags, collapse whitespace, trim); helpers `questionOf(n, total)`, `optionOf(n, text)`, `requiredText()` (localized via `tts` namespace when available). Never speak hidden/technical text.
7. `src/lib/tts/server-cache.ts` — **best-effort only**, NOT a reliable shared cache (app may run across serverless instances). In-memory `Map<key, Buffer>` with TTL (default 1h), key = `language|voice|hash(text)`. Skip when `userContent: true`. Bounded size, oldest-first eviction. Never persisted to disk. The client-side cache/dedupe is the primary mechanism for repeated static UI/question audio.
8. `src/lib/tts/server-rate-limit.ts` — per-IP in-memory throttle: min-interval (e.g., 500ms) + max burst (e.g., 15/min) → HTTP 429 `TTS_RATE_LIMITED`; exponential backoff / cooldown window on upstream 429 per key. In-memory only (documented as non-shared across instances).
9. `src/app/api/tts/route.ts` — `POST`:
   - Parse `{ text, locale, type?, voice? }`.
   - Validate: text is a string, `text.length <= maxChars` (else 413 `TTS_TEXT_TOO_LONG`); locale valid, else `en`.
   - Normalize text for speech.
   - Rate-limit per IP.
   - Resolve voice via `resolveVoice(locale)`; if `unavailable` → 422 `TTS_VOICE_UNAVAILABLE`.
   - **`voice` override in the body is honored ONLY when `TTS_ALLOW_VOICE_OVERRIDE=true` AND `process.env.NODE_ENV !== "production"`** (dev/testing). Otherwise it is rejected/ignored.
   - Server cache lookup; on miss, `getTTSProvider().synthesize(...)`, store buffer (unless `userContent`).
   - **Success response: MP3 bytes directly — `Content-Type: audio/mpeg`, `X-Request-Id` header, status 200.** NOT Base64-in-JSON.
   - **Error response:** JSON `{ success: false, error: "TTS_TEXT_TOO_LONG" | "TTS_VOICE_UNAVAILABLE" | "TTS_RATE_LIMITED" | "TTS_UNAVAILABLE" }` with 413/422/429/502.
   - Dev logging only (locale, voice, duration, cache hit/miss, status). Never log text or sensitive data in production.
10. `src/components/tts/TTSProvider.tsx` (client) — context + `useTTS()`:
    - State: `enabled` (default OFF, persisted `localStorage["tts_enabled"]`), `isSpeaking`, `isPaused`, `currentText`, `status: "idle"|"loading"|"speaking"|"paused"`.
    - One shared `HTMLAudioElement`.
    - `speak(opts)`:
      - normalize text; reject empty.
      - **Automatic gating:** if `opts.automatic === true && !enabled` → skip. Explicit calls (`automatic` false/omitted, e.g., TTSButton) always proceed.
      - dedupe: ignore if identical `text+language` already loading/speaking (prevents repeated requests).
      - priority: `error|warning|confirmation` (HIGH) and `question|instruction|success` (MEDIUM) replace current; `label|helper` (LOW) only when idle.
      - client cache lookup (in-memory `Map` key `language|voice|hash(text)` → blob URL); skip for `userContent`.
      - `fetch("/api/tts", {method:"POST", body:{text, locale, type}})`. If `res.ok` → `await res.blob()` → `URL.createObjectURL(blob)` → play. Else parse JSON error and map gracefully.
      - On `NotAllowedError` (autoplay block): fail silently, surface `autoplayBlocked` so the button remains the manual trigger; no retry loop.
      - `audio.onended` → idle.
    - `stop()`, `pause()`, `resume()`, `setEnabled(v)` (persists, stops current when disabled).
    - Track `hasInteracted` (pointerdown/keydown once) — automatic speech fires only when enabled AND interacted; bulk auto-reading (whole page/form/all options) is never performed.
    - Stop on `pathname` change and on unmount.
    - On locale change from `useAppLocale()`: `stop()`, clear client cache.
    - Expose `resolveVoiceStatus(locale)` (via the registry) so UI can show the `voiceUnavailable` disabled state for pa/or without calling the API.
11. `src/components/tts/TTSButton.tsx` — small speaker button: explicit `speak(text, type?)`; always speaks (bypasses the `enabled` gate); icon toggles play/stop; loading spinner while generating; localized `aria-label` that reflects state (Play/Stop/Pause/Resume) + `aria-pressed`; `disabled` while loading; keyboard accessible; matches existing indigo/white styling. If `resolveVoice` would be `unavailable` for the active locale (pa/or), render disabled with localized `voiceUnavailable` label — no API call.
12. `src/components/tts/VoiceAssistanceToggle.tsx` — compact speaker ON/OFF pill/icon; `aria-pressed`; localized label from `tts` namespace; matches navbar ghost/light + dark variants like `LanguageSwitcher` (optional `variant` prop).

## Files to modify

1. `src/app/ClientLayout.tsx` — wrap children with `<TTSProvider>` **inside** `<I18nProvider>` (it calls `useAppLocale()`).
2. `src/components/navbar/SiteNavbar.tsx` — render `<VoiceAssistanceToggle variant={isScrolled ? "dark" : "light"} />` beside `<LanguageSwitcher>` (desktop) and inside the mobile menu row.
3. `src/app/login/page.tsx` — add `<VoiceAssistanceToggle />` near the "Back to Home" control (top-right).
4. `src/components/auth/LoginCard.tsx` — TTS integration:
   - On the FIRST focus of the email field (AUTOMATIC, only when enabled; per-field `spokenRef` so re-focus never re-speaks): "Email address. Please enter your email address."
   - On the FIRST focus of the password field (AUTOMATIC, only when enabled; per-field `spokenRef`): "Password. Please enter your password."
   - **Repeated focus on the same field must NOT create repeated API requests or speech** — per-field `spokenRef` + client cache + same-text dedupe in the manager.
   - On validation/`not_found` error transitions (AUTOMATIC, HIGH): speak the error once when the error string actually changes (compare previous value via ref); never on every render.
   - On `not_found` step entry: speak "No account found…" guidance once.
   - Add `<TTSButton>` (manual, always available) beside the email and password labels.
   - **Never speak keystrokes or the user's entered email/password** — no `onChange` speech; automatic speech uses static localized phrasing only.
5. `src/components/assessment/AssessmentModal.tsx` — TTS integration:
   - Personal-details form: first-focus guidance per field (AUTOMATIC, per-field `spokenRef`) + validation errors on actual change (AUTOMATIC, HIGH) + `<TTSButton>` beside labels (manual). No per-keystroke speech; never auto-speak entered name/email/phone values.
   - Questions step: when the current question actually changes (track `lastSpokenQuestionId` via ref) AND enabled AND interacted → auto-read `questionOf(n, total) + translated question_text` (AUTOMATIC, MEDIUM). **Not re-read on re-render, focus changes, or state updates.**
   - Per-question manual `<TTSButton>` (type `question`) on the question heading.
   - Per-option manual `<TTSButton>` (type `option`) — options are NEVER auto-read, only on explicit click.
   - Result step: speak a short success summary (AUTOMATIC, MEDIUM) once when the result first renders (ref-gated), without re-reading on later renders.
   - **Speak the exact `translateAssessment(locale, questions)` strings that are displayed — no independent translation.**
   - Guard against duplicate speech on re-render (ref-gated fired flags + manager dedupe).
6. `messages/en.json` — add `tts` namespace: `onLabel`, `offLabel`, `speakAria`, `stopAria`, `pauseAria`, `resumeAria`, `loadingLabel`, `voiceUnavailable`, `questionOf` (`Question {n} of {total}.`), `optionOf` (`Option {n}. {text}`), `emailFocus`, `passwordFocus`, `fieldRequired` (`This field is required.`), `noAccountFound`. Other locales fall back to English via deep-merge; translations optional later.
7. `src/i18n/locales.ts` — NO change (TTS reads from the existing locale source; 28 keys stay untouched).
8. `CHANGELOG.md` + new `docs/TTS.md` — architecture, provider swap guide, voice matrix, FreeTTS licensing caveat, provider limits as config values.

## Accessibility (revised)

- No `aria-live` status region — avoids duplicate announcements for screen-reader users.
- TTS state is communicated through the controls themselves: `aria-pressed` on TTSButton/VoiceAssistanceToggle, dynamic localized `aria-label` (Play/Stop/Pause/Resume/Loading), visible focus rings, `disabled` while generating, and a localized disabled label when the language has no voice.
- TTS complements (never replaces) existing assistive tech; does not use the browser SpeechSynthesis API.

## Security / abuse protection

- Text capped at `FREETTS_MAX_CHARS` (1000) — never unbounded.
- Per-IP in-memory rate limit + min-interval; upstream 429 → cooldown/backoff, no auto-retry loop.
- Server cache is best-effort, bounded, TTL'd; `userContent` (email/name/free-text) never cached; only static UI/question text cached. Client cache is the primary mechanism.
- No user text logged server-side in production; dev logs exclude full text.
- `/api/tts` stays public (works pre-login); self-protected by the above.
- Timeouts on all upstream calls; graceful `TTS_UNAVAILABLE`; the site never breaks when TTS fails (speak() calls are fire-and-forget, errors swallowed to console only).
- `voice` override rejected outside dev (`TTS_ALLOW_VOICE_OVERRIDE=true` + non-production).

## Error handling / fallback

- Invalid locale → `en`.
- `pa`/`or` → `TTS_VOICE_UNAVAILABLE` (422); TTSButton disabled with localized label; auto-read skips silently. No misleading Hindi audio labeled as Punjabi/Odia.
- Upstream 429 → `TTS_RATE_LIMITED`; client short cooldown (e.g., 3s), no auto-retry; button remains usable.
- Autoplay blocked → silent fail; speaker button remains the manual trigger.
- Network/timeout → `TTS_UNAVAILABLE`; no UI error text; forms continue to work.

## Rate-limit protection summary

Client (primary): dedupe identical requests, blob-URL cache for repeated static UI/question audio, debounce question auto-reads, `userContent` bypasses cache but still dedupes. Server: per-IP throttle, min-interval, best-effort bounded TTL cache, 429 cooldown. This keeps the 20 req/min/IP free-tier limit from being exhausted by normal login + questionnaire navigation.

## Language-switching behavior

`useAppLocale().locale` drives voice resolution through the normalization layer. Existing `setLocale()` reloads the page (cookie change) — speech stops on reload. On any in-app locale change without reload, the manager calls `stop()` and invalidates the client cache. No overlap between languages ever.

## Implementation order

1. TTS core modules (`tts-types`, `tts-config`, `voice-registry` incl. `normalizeLanguage`, providers, `text-utils`, `server-cache`, `server-rate-limit`).
2. `/api/tts` route (binary MP3 success / JSON error contract).
3. Client `TTSProvider` + `useTTS` + `TTSButton` + `VoiceAssistanceToggle`.
4. Wire into `ClientLayout`; add `tts` namespace to `messages/en.json`.
5. Navbar toggle (desktop + mobile) and login page toggle.
6. LoginCard integration (automatic focus/error speech + manual TTSButton).
7. AssessmentModal integration (form, questions, options, result — using `translateAssessment` output exactly).
8. `docs/TTS.md`, `CHANGELOG.md`.

## Validation

- `npx tsc --noEmit`
- `npm run build`
- Manual dev matrix (no test framework in repo):
  - Locales: spot-check en, hi, mr, zh-tw, ar (RTL), bn (both labels → same voice), ur + ur-in (same voice), pa/or (voice-unavailable state), kn.
  - Pages: `/login` (all three steps), assessment modal (form → questions → result).
  - Events: first field focus (repeat focus → no speech, no request), TTSButton click with global toggle OFF (must still speak), question change (auto-read fires once per question change; NOT on re-render/focus/state updates), validation error (spoken once on actual change), success, language change while speaking, stop/pause/resume, rapid clicks (dedupe).
  - Edge cases: empty text, 1 char, ~1000 chars, >1000 chars (413), unsupported locale, FreeTTS 429, timeout/network failure, page unmount while speaking, mobile (Chrome Android / Safari iOS autoplay), typing in a field produces no speech, entered email/password never spoken.
  - Regression: all existing forms still submit normally with TTS unavailable.

## Risks / limitations (documented in `docs/TTS.md`)

- Free tier is not commercially licensed and adds a watermark → production must use a commercial provider via `TTS_PROVIDER` or FreeTTS PRO.
- `pa`/`or` have no verified FreeTTS voice → voice-unavailable state (button disabled), no misleading Hindi fallback.
- 20 req/min/IP upstream cap → client cache/dedupe + server throttle are load-bearing; heavy concurrency may degrade TTS availability (site still works).
- Server cache is best-effort in-memory only (serverless instances don't share it); client cache is the reliable layer.
- Provider limits may change — all are env config in `tts-config`, not hardcoded facts.
- API surface and limits may change; all FreeTTS specifics are isolated behind the provider interface and `tts-config`.
