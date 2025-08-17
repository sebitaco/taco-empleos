# Implementation Plan – Taco Empleos Waitlist v0
_Zero-auth, no emails/newsletters. Mirrors the reference layout: Hero “search” → Job list (static) → Featured Companies → Tag Cloud → Articles → Market Info → Employer CTA → Waitlist Box → Footer._

---

## 1) Repo & Deploy Baseline
**Instructions**
- Create repo with branch protection on `main` (PRs required).
- Set up preview + production environments (e.g., Vercel) with separate env groups.
- Define env vars now: `DB_URL`, `SITE_URL`, optional `SENTRY_DSN`.
**Test**
- Open a PR that edits a placeholder page; preview auto-deploys; merge blocked until checks pass.

---

## 2) Page Map & Content Inventory
**Instructions**
- Confirm routes and section order to match the screenshot:
  - `/` (Home): **Hero “search” block** ➜ **Job list (static data)** ➜ **Featured Companies grid** ➜ **Tag/Skills cloud** ➜ **Articles** ➜ **Market info text** ➜ **Employer CTA** ➜ **Waitlist signup box** ➜ **Footer with mega-links**.
  - `/thanks` (post-submit).
  - `/privacy`, `/terms`.
- Draft all copy (titles, blurbs, CTAs) and get sign-off.
**Test**
- Stakeholder review doc approved; no missing headings or labels.

---

## 3) Visual System & Layout Shell
**Instructions**
- Lock design tokens to emulate the reference (colors, fonts, spacing, radii, shadows).
- Define container widths and breakpoints; set section paddings to replicate vertical rhythm.
- Build static header/nav and footer structure (mega-footer with columns).
**Test**
- Visual QA at 360/768/1024/1280/1440 px: header/footer stable; no wrapping; spacing rhythm feels like the screenshot.

---

## 4) Hero “Search” Section (UI only)
**Instructions**
- Create a hero block visually resembling a search panel:
  - Title/subtitle on the left.
  - Two input look-alikes (Keyword, Location) and a primary CTA button (non-functional for v0, scrolls to waitlist).
  - Small note with “No auth required”/privacy reassurance.
**Test**
- At 360px and 1280px the inputs/CTA line up like the reference; CTA scrolls to waitlist box.

---

## 5) Job List (Static Showcase)
**Instructions**
- Add a scrollable list of ~12 static “job cards” to mimic activity (logo, role, company, location, posted time, “Apply” button that is disabled or links to `#`).
- Include pagination look-alike controls (non-functional).
- Add a slim filter bar shell (chips/links) to match the layout (non-functional).
**Test**
- Cards align in a single column on mobile, two columns where applicable on wide; no overflow; hover/active states visible.

---

## 6) Featured Companies Grid
**Instructions**
- 8–12 company logo cards with a tiny blurb and “View roles” link (links to `#` or future routes).
- Logos normalized to consistent bounding box; apply subtle shadow and rounded corners as in the screenshot.
**Test**
- Grid wraps 2/3/4 columns across breakpoints; logos crisp (no distortion).

---

## 7) Tag / Skills Cloud
**Instructions**
- Dense cluster of role tags (Mesero, Cocinero, Barista, Hostess, Lavaloza, etc.).
- Tags are visually interactive but non-functional in v0.
**Test**
- Tags wrap naturally and remain legible on mobile; spacing matches screenshot density.

---

## 8) Articles / Resources
**Instructions**
- 6 article cards with image, title, short excerpt, “Read more” (to blog placeholders).
- Maintain identical card ratio and gutter spacing to the reference.
**Test**
- All cards align; images keep aspect ratio; titles don’t overflow two lines.

---

## 9) Market Info Text Block
**Instructions**
- A text section with 4–6 short paragraphs about hospitality jobs in Mexico (adapted to your niche but mirroring the length/feel of the reference).
**Test**
- On desktop, lines remain <90 characters; on mobile, paragraphs stack with comfortable line-height.

---

## 10) Employer CTA (Mid-page)
**Instructions**
- Simple band with headline + centered button “Post your job” that anchors to the waitlist box.
**Test**
- Button visible above the fold on common laptop resolution; anchor works.

---

## 11) Waitlist Signup Box (Dual Audience, No Email Sending)
**Instructions**
- Single form with audience selector (Employer / Candidate).
- Fields:
  - **Common:** Email (required), City (required), “How did you hear about us?” (optional), Consent checkbox (required).
  - **If Employer:** Company name (required), Hiring needs (short text).
  - **If Candidate:** Role of interest (required), Years of experience (required), Preferred city (optional).
- On submit: save to DB and redirect to `/thanks`. No emails sent.
**Test**
- Submitting without required fields or consent is blocked with inline errors.
- Two successful test submissions (one per audience) appear in DB with correct fields.

---

## 12) Mega-Footer
**Instructions**
- Build a large footer with grouped links (by city, by role, by company), social icons, small print, and a “Post a Job / Join Waitlist” mini-CTA.
- Ensure contrast and accessible link focus states.
**Test**
- Tab through all links; focus ring visible; no overlap; links keyboard-navigable.

---

## 13) Data Model & Storage
**Instructions**
- Single table `Waitlist`:
  - `id`, `audience ('employer'|'candidate')`, `email`, `city`, `source`,
  - `company_name`, `needs`,
  - `role`, `experience_years`, `preferred_city`,
  - `consent` (boolean), `created_at`.
- Unique index on `(email, audience)`. Add index on `created_at`.
**Test**
- Attempt duplicate submit (same email+audience) → gracefully handled; DB enforces uniqueness.

---

## 14) Spam/Abuse & Basic Security
**Instructions**
- Add bot challenge (Cloudflare Turnstile or hCaptcha) on the waitlist form.
- Rate-limit submissions by IP + email (e.g., 3/15m, 10/day).
- Apply security headers site-wide (CSP without inline scripts, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, X-Content-Type-Options nosniff).
**Test**
- Automated submissions without challenge → blocked.
- Rapid submits → receive rate-limit message.
- Response headers verified via browser devtools.

---

## 15) SEO, Analytics & Legal
**Instructions**
- Titles + meta descriptions per page; Open Graph defaults.
- `/sitemap.xml` listing: `/`, `/thanks`, `/privacy`, `/terms`.
- Add lightweight analytics (e.g., Plausible) events:
  - `waitlist_submit` (audience, city),
  - `cta_click` (section: hero, employerCTA, footer).
- Publish `/privacy` and `/terms`; link from footer; store `consent=true` with each row.
**Test**
- Lighthouse SEO > 90 on Home.
- Events appear in analytics dashboard within 10 minutes.
- Privacy/Terms reachable and legible; consent stored in DB.

---

## 16) Monitoring, Backups & Launch
**Instructions**
- Enable error monitoring (Sentry) and simple uptime checks for `/`.
- Daily DB backups with a restore runbook.
- Final checklist: content approved, form works for both audiences, bot challenge and rate-limit active, analytics events firing, sitemap valid.
**Test**
- Force a test error; verify it’s captured with context.
- Simulate downtime in staging; uptime alert triggers.
- Validate `/sitemap.xml` loads, links resolve, no 404s.

---

## OWASP Quick Alignment (v0 scope)
- **A01 Broken Access Control:** Only one public POST; rate-limited; no privileged routes.
- **A02 Crypto Failures:** HTTPS enforced; no secrets echoed to client.
- **A03 Injection:** Length-check inputs; parameterized DB writes; escape output.
- **A04 Insecure Design:** Bot challenge + rate-limits from day one.
- **A05 Misconfiguration:** Security headers applied; verbose errors disabled.
- **A06 Outdated Components:** Keep deps current; enable alerts.
- **A07 Auth Failures:** No session auth in v0; single POST guarded.
- **A08 Integrity Failures:** CI deploys; tracked migrations.
- **A09 Logging/Monitoring:** Submits logged (no PII in logs); anomaly alerts.
- **A10 SSRF:** No server fetch of user-supplied URLs in this version.

---

## Success Metrics (for v0)
- **Homepage → Submit** conversion ≥ 5%.
- **Employer share** of signups ≥ 30%.
- **Spam rate** (blocked/total) ≤ 10%.
- **Bounce on mobile** (home) ≤ 40%.

---

## Tech Stack (for v0)
- **Framework:** Next.js (App Router), React 18, **JavaScript** (no TypeScript yet)
- **Styling:** Tailwind CSS; shadcn/ui (Radix primitives) for consistent components; lucide-react icons
- **Forms:** Native HTML validations (no email sending); client logic minimal
- **Database:** Postgres (Neon or Supabase)
- **ORM / Migrations:** Drizzle
- **Anti-abuse:** Cloudflare Turnstile or hCaptcha; simple rate-limiter (e.g., Upstash Ratelimit)
- **Analytics:** Plausible (privacy-friendly)
- **Monitoring:** Sentry (errors), external uptime (e.g., Better Uptime)
- **SEO:** next-seo (or manual metas), XML sitemap, robots
- **Hosting:** Vercel (preview + prod)