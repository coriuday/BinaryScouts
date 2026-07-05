# BinaryScouts QA Report

**Date:** 2026-07-05  
**Targets:** Local (`http://localhost:3001`) + Production (`https://binaryscouts.onrender.com`)  
**Tester:** Automated + browser snapshot verification

---

## Summary

| Phase | Result |
|-------|--------|
| Lint | PASS (2 non-blocking `<img>` warnings) |
| Build | PASS (35 routes) |
| `verify:production` | PASS (8/8) |
| Extended API matrix (prod) | 13/14 PASS (1 rate-limit skip) |
| Extended API matrix (local) | 13/14 PASS (heist 503 — Rust not running) |
| Route HTTP checks | PASS all public routes (prod + local) |
| Browser E2E (snapshots) | PASS homepage, contact, privacy |
| Admin CMS (local) | PASS (9/9) |
| Admin CMS (prod) | Not executed (blocked by environment policy) |

**Overall health:** Good. Core site, CMS, forms, and admin work. Main gaps are **email delivery via Resend**, **careers applications not saved**, and **AI chat running in offline/fallback mode**.

---

## Critical

_None found._ No auth bypass, data loss on contact forms (leads persist to Supabase), or broken public routes.

---

## Major

### 1. Contact form emails not delivered (`delivered: false`)

- **Repro:** `POST /api/contact` with valid contact payload on prod or local.
- **Observed:** `{ ok: true, delivered: false }`. Lead still saved (6 leads visible in admin).
- **Likely cause:** Resend API key missing/invalid on Render, unverified sender domain, or `onboarding@resend.dev` restrictions.
- **Fix:** Verify `RESEND_API_KEY` on Render; verify domain in Resend dashboard; set `CONTACT_FROM_EMAIL` to verified sender; optionally surface `delivered: false` in UI.

### 2. Careers applications are never saved

- **Repro:** `/careers` → select role → fill form → submit → success message.
- **Observed:** `handleSubmit` only calls `setSubmitted(true)` — no `fetch` to API.
- **File:** `components/pages/CareersPage.tsx` (lines 71–76)
- **Fix:** Wire to `/api/contact` with `type: 'careers'` or new endpoint + Supabase table.

### 3. Terminal / chat uses offline fallback

- **Repro:** `POST /api/chat` with `{ message: "Hello" }`.
- **Observed:** Response contains offline/safe-mode themed text, not live Gemini output.
- **Likely cause:** `GEMINI_API_KEY` on Python service may be wrong format (`AQ.` vs `AIzaSy...`).
- **Fix:** Replace with Google AI Studio `AIzaSy...` key on `binaryscouts-python` Render service.

### 4. Planner heist fails locally without Rust

- **Repro:** `POST /api/heist` on `localhost:3001`.
- **Observed:** `503 Service temporarily unavailable`.
- **Cause:** Rust gateway not running; `RUST_API_BASE_URL` not set in `.env.local`.
- **Fix:** Start `backend-rust` locally or document dev requirement. Production heist works (`DISPATCHED`).

### 5. Contact info CMS sync is inconsistent

- **Repro:** Footer/FAB use `useContactInfo` (CMS-aware). Contact page, privacy, terms use module-level `getContactEmail()` / `getPhoneDisplay()` (env-only).
- **Impact:** Admin Site Settings contact changes update footer/FAB but not `/contact` info cards or legal pages until redeploy/env change.
- **Fix:** Use `useContactInfo` on `ContactPage.tsx`; consider same for legal pages or server-fetch CMS settings.

---

## Minor

### 6. Footer social links are generic placeholders

- **File:** `components/layout/Footer.tsx` — `https://github.com`, `https://linkedin.com`, `https://x.com`
- **Fix:** Point to BinaryScouts org/profile URLs.

### 7. Newsletter API omits `delivered` field

- **Observed:** Contact form returns `delivered`; newsletter returns `{ ok: true }` only.
- **Fix:** Return consistent `delivered` boolean for both types.

### 8. No approved testimonials on homepage

- **Observed:** `GET /api/reviews` → `{ reviews: [] }`; UI shows "No reviews yet."
- **Note:** QA submissions land as pending; admin must approve in `/admin` → Reviews tab.

### 9. ESLint warnings on `<img>` tags

- **Files:** `AboutPage.tsx`, `AdminDashboardPage.tsx`
- **Fix:** Migrate to `next/image`.

### 10. Duplicate CMS settings fetches

- **Observed:** Footer + WhatsAppFab each fetch `/api/cms/settings` on mount.
- **Fix:** Optional React context or SWR cache.

### 11. `getPhoneDisplay()` ignores env vars

- **File:** `lib/site-contact.ts` — always returns `DEFAULT_PHONE_DISPLAY`.
- **Fix:** Read `NEXT_PUBLIC_WHATSAPP_NUMBER` and format for display, or rely solely on CMS.

### 12. `.env.local` missing optional `RUST_API_BASE_URL`

- Not blocking if Rust runs on default `127.0.0.1:8081`, but local heist/chat need Rust process.

---

## Known gaps / by design

| Item | Status |
|------|--------|
| Careers form | UI-only success (no backend) — confirmed bug, not intentional |
| Games `/games` | Server redirect to `/work` — works in browser |
| Honeypot | `website` field → silent `{ ok: true }` — PASS |
| Admin unauthenticated | `GET /api/admin/projects` → 401 — PASS |
| Rate limits | Reviews 3/hr/IP — hit during automated testing (expected) |

---

## What passed

- All public routes load (200) on prod + local
- CMS: projects, team, settings with `contactInfo` (Gmail + WhatsApp)
- Contact + newsletter forms accept valid input and persist leads
- WhatsApp FAB visible; footer shows `thebinaryscouts@gmail.com` + phone link
- Contact page info cards (email, WhatsApp, availability, studio)
- Privacy policy shows updated Gmail
- Sitemap + robots.txt correct
- Rust gateway ONLINE; Python health `key_configured: true`
- Admin login/logout, projects (2), team (3), leads (6), settings — all local
- Production `verify:production` — 8/8

---

## Recommended fixes (by impact)

1. Fix Resend on Render → contact emails reach `thebinaryscouts@gmail.com`
2. Wire careers form to backend
3. Replace Gemini API key for live Terminal chat
4. Unify contact info via `useContactInfo` on ContactPage + legal pages
5. Update footer social URLs to real profiles
6. Approve pending reviews in admin (or seed approved reviews)
7. Add `next/image` for admin/about photos
8. Document local dev: Rust + Python for full planner/chat stack

---

## Helper scripts added (for re-runs)

```bash
npm run verify:production
node scripts/qa-api-matrix.mjs https://binaryscouts.onrender.com
node scripts/qa-api-matrix.mjs http://localhost:3001
node scripts/qa-admin.mjs http://localhost:3001
```

---

## Post-fix manual config (required for email + live AI)

These are **not code changes** — set on Render, then redeploy:

### Resend (contact/newsletter emails)

1. Render → **BinaryScouts** web service → Environment
2. Confirm: `RESEND_API_KEY`, `CONTACT_TO_EMAIL=thebinaryscouts@gmail.com`
3. Resend dashboard → verify sender domain or use `onboarding@resend.dev` for testing
4. Redeploy web service
5. Submit test contact form → check `delivered: true` in network tab or Gmail inbox

### Gemini (Terminal + planner AI)

1. Get `AIzaSy...` key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Render → **binaryscouts-python** → set `GEMINI_API_KEY`
3. Redeploy Python service
4. Test `POST /api/chat` — response should not be offline fallback text

### Local dev (planner/chat)

Add to `.env.local`:

```env
RUST_API_BASE_URL=http://127.0.0.1:8081
```

Run `backend-rust` locally when testing `/planner` or Terminal.

### Testimonials

Run `npm run seed` to upsert an approved sample review, or approve pending reviews in `/admin` → Reviews.
