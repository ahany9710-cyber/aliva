# Beitlee — Real Estate Landing Pages

Landing page system for Egyptian real estate projects, optimized for Google Ads lead generation.

## Tech Stack

- Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- Supabase for lead storage
- Deploy: Vercel + GitHub

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # add your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Go to [http://localhost:3000/mountainview](http://localhost:3000/mountainview) for the first landing page.

## Environment Variables

In `.env.local` (and in Vercel for production):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Publishable (client-safe) key
- `SUPABASE_SECRET_KEY` — Secret key (server-only, for `/api/leads`)

## Supabase Setup

1. **Option A (CLI):** `supabase link --project-ref lreayrvngzhvhcgmazcg` then `supabase db push` to apply migrations in `supabase/migrations/`.
2. **Option B:** Run `supabase-leads-schema.sql` in the Supabase SQL Editor (Dashboard → SQL Editor).

## Folder Structure

```
app/
  layout.tsx          # Root layout, fonts, default metadata
  page.tsx            # Minimal homepage
  thank-you/page.tsx  # Post-form success page
  [slug]/page.tsx     # Dynamic route: /mountainview, /tajcity, etc.
  api/leads/route.ts  # POST handler — saves leads to Supabase

components/
  layout/              # MinimalHeader, MinimalFooter, StickyMobileCTA
  sections/            # Hero, Highlights, WhyThis, Location, Pricing, LeadForm, FAQ, FinalCTA
  ui/                  # Button, SectionWrapper, Badge
  LandingPageTemplate.tsx   # Composes all sections for a project

content/projects/
  index.ts             # Registry: slug → content (add new projects here)
  mountainview.ts      # Mountain View project content

types/project.ts       # ProjectContent interface
lib/utils.ts           # cn(), formatPrice(), buildWhatsAppUrl()
lib/supabase.ts        # Supabase client (browser + server)
```

## How to Add a New Landing Page

1. **Create content file**  
   Copy `content/projects/mountainview.ts` to e.g. `content/projects/tajcity.ts`. Fill in all fields (slug, projectName, headline, pricing, FAQs, etc.).

2. **Register the project**  
   In `content/projects/index.ts`, import the new content and add it to the `projects` object:
   ```ts
   import { tajCityContent } from "./tajcity";
   const projects = {
     mountainview: mountainViewContent,
     tajcity: tajCityContent,
   };
   ```

3. **Done.**  
   The page is live at `/tajcity`. No changes to routes or components.

## Where to Edit Content

- **Per-project copy, prices, FAQs, CTAs:** `content/projects/<slug>.ts`
- **Global site title / default meta:** `app/layout.tsx`
- **Thank-you page text:** `app/thank-you/page.tsx`
- **Header/footer text:** `components/layout/MinimalHeader.tsx`, `MinimalFooter.tsx`

## Deploy (Vercel + GitHub)

1. Push the repo to GitHub.
2. In Vercel: **New Project** → Import the repo → set **Environment Variables** (same as `.env.local`):

   | Name | Value | Notes |
   |------|--------|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://lreayrvngzhvhcgmazcg.supabase.co` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | (your publishable key) | From Supabase Dashboard → Settings → API |
   | `SUPABASE_SECRET_KEY` | (your secret key) | Server-only; used by `/api/leads` |

3. Deploy. Future pushes to `main` auto-deploy. No `vercel.json` required for this app.
