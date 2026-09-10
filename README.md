# Manan Kundra — Portfolio

A dark, minimal one-page portfolio (inspired by majd-portfolio.framer.website),
built with plain HTML/CSS/JS — no build step, deploys as-is.

## Structure
```
manan-portfolio/
├── index.html
├── css/style.css
├── js/script.js
└── assets/
    ├── avatar-placeholder.svg   ← swap this for your real photo
    └── Manan_Kundra_Resume.pdf  ← powers the "Download résumé" button
```

## 1. Your photo
Already wired in — `assets/manan-photo.jpg` (cropped from the photo you sent) is set
as the hero avatar. To swap it later, drop a new square image into `assets/` and update
the `src` on the `#profilePhoto` `<img>` in `index.html`.

## 2. Update the résumé file
Replace `assets/Manan_Kundra_Resume.pdf` with your latest resume whenever it changes
(keep the same filename, or update the `href` in the "Download résumé" button).

## 3. Wire up the contact form (Supabase)
The form is coded to insert into Supabase, but needs your project's credentials:

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open **SQL Editor** → paste in `supabase-schema.sql` from this folder → **Run**.
   This creates a `portfolio_inquiries` table with Row Level Security enabled, and a
   policy that only allows public **inserts** (no one can read/edit/delete via the
   public key — you'll view submissions in the Supabase **Table Editor**).
3. Go to **Project Settings → API**, copy the **Project URL** and **anon public** key.
4. Open `js/script.js`, and fill in:
   ```js
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
5. Reload the site — submissions now land in the `portfolio_inquiries` table.
   Until these are filled in, the form falls back to opening the visitor's email client.

## 4. Deploy
**Vercel**: `vercel` in this folder (or drag-and-drop the folder into the Vercel dashboard) — no build settings needed, it's static.
**Hostinger**: upload the contents of this folder to `public_html` via File Manager or FTP.

## Notes
- Colors, type, and spacing live as CSS variables at the top of `css/style.css` (`:root`)
  if you want to adjust the palette or fonts later.
- Sections map to your resume 1:1: About → summary/education, What I do → skills,
  Featured work → the 3 resume projects, Experience → internships, Certifications →
  achievements, Contact → your real email/phone/LinkedIn/GitHub.
- Testimonials and a blog were skipped (not in your resume) — happy to add either
  once you have content for them.
