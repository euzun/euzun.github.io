# DESIGN.md — euzun.github.io
**Personal/Professional Website for Erkam Uzun**
**Status: Pre-implementation design document. Review before any code is written.**
**Date: 2026-05-11**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack with Versions](#2-tech-stack-with-versions)
3. [Folder / File Tree](#3-folder--file-tree)
4. [Content Collection Schemas](#4-content-collection-schemas)
5. [Page Wireframes](#5-page-wireframes)
6. [Component Inventory](#6-component-inventory)
7. [Design Tokens](#7-design-tokens)
8. [Typography Proposals (Pick One)](#8-typography-proposals-pick-one)
9. [Accent Color Proposals (Pick One)](#9-accent-color-proposals-pick-one)
10. [SEO and Social Strategy](#10-seo-and-social-strategy)
11. [Accessibility Plan](#11-accessibility-plan)
12. [Deployment](#12-deployment)
13. [Open Questions for User](#13-open-questions-for-user)

---

## 1. Executive Summary

This document specifies the complete design for Erkam Uzun's personal professional website at `https://euzun.github.io`. The site is a blog-forward, academic-professional hybrid — a place to publish cryptography and AI research posts, surface 20+ publications with proper citation tooling, list 6 USPTO patents, and present a curated portfolio of projects ranging from TikTok Passkey (100M+ users) to a 24× productivity agentic AI framework.

**Technology foundation:** Astro 5 (static site generation) + Tailwind CSS v4 + MDX + Astro Content Collections. Deployed to GitHub Pages via GitHub Actions. All content is file-based (no CMS, no database), making the site portable, fast (static), and trivially version-controlled.

**Guiding principle:** Content-first, typography-first. The site should feel like a well-edited technical journal, not a portfolio showcase. Every page exists to surface Erkam's intellectual output. Design is in service of the words.

**Key metrics this design must support:**
- Core Web Vitals: LCP < 1.5s, CLS < 0.05, INP < 100ms (static site, easily achievable)
- Lighthouse performance: 95+ across all pages
- Zero JavaScript for core reading experience (Astro's default island architecture)
- WCAG 2.1 AA compliance

**Scope of this document:** Design only. No implementation code is written here. After user review and sign-off (especially on font and color choices), implementation begins with Phase 1.

---

## 2. Tech Stack with Versions

### Core Framework

| Package | Version | Role |
|---|---|---|
| `astro` | `^5.x` (latest stable, ~5.7 as of May 2026) | Static site generator, routing, Content Collections, SSG |
| `@astrojs/mdx` | `^4.x` | MDX processing for blog posts |
| `@astrojs/sitemap` | `^3.x` | Auto-generated sitemap.xml |
| `@astrojs/rss` | `^4.x` | RSS 2.0 feed for blog |

### Styling

| Package | Version | Role |
|---|---|---|
| `tailwindcss` | `^4.x` (Oxide engine) | Utility-first CSS |
| `@tailwindcss/vite` | `^4.x` | Vite plugin integration (replaces @astrojs/tailwind) |
| `@tailwindcss/typography` | `^0.5.x` | `prose` class for MDX rendered content |

**Tailwind v4 trade-off documented:**
Astro 5's recommended Tailwind integration in 2026 is `@tailwindcss/vite` (Tailwind v4) rather than the legacy `@astrojs/tailwind` (v3). The trade is:

| Concern | v3 (@astrojs/tailwind) | v4 (@tailwindcss/vite) — CHOSEN |
|---|---|---|
| Config file | `tailwind.config.mjs` (JS) | CSS-first via `@theme {}` in global CSS |
| Performance | Good (PostCSS) | Faster (Oxide engine, Rust-based) |
| Dark mode | `class` strategy in config | `@variant dark` in CSS, same result |
| Browser compat | IE11 if needed | Modern only — fine for this site |
| Ecosystem plugins | All v3 plugins | v4 plugin ecosystem maturing; `@tailwindcss/typography` is supported |
| Stability | Mature, stable | Stable as of v4.1+, production-ready |

v4 is chosen because: (1) it eliminates a config JS file in favor of CSS co-location, (2) its Oxide engine is ~10× faster for large builds, and (3) as of Astro 5 / 2026, v4 is the primary recommended path. For a personal site, there is no IE11 concern.

### Content and Math

| Package | Version | Role |
|---|---|---|
| `remark-math` | `^6.x` | Parse `$...$` and `$$...$$` in MDX |
| `rehype-katex` | `^7.x` | Render math as KaTeX HTML |
| `katex` | `^0.16.x` | KaTeX runtime (CSS loaded from CDN or bundled) |

### Search

| Package | Version | Role |
|---|---|---|
| `pagefind` | `^1.x` | Client-side full-text search, built post-`astro build` |

### Code Highlighting

| Package | Version | Role |
|---|---|---|
| Shiki | Built into Astro 5 | Syntax highlighting in MDX code blocks. No extra install needed. |

### Deployment

| Tool | Version | Role |
|---|---|---|
| `pnpm` | `^9.x` | Package manager (fastest for CI, Astro-preferred) |
| GitHub Actions | n/a | CI/CD pipeline |
| `actions/deploy-pages` | `v4` | GitHub Pages deployment |

### Type Safety

Astro 5 Content Collections use Zod (`z` from `astro:content`) for schema validation. TypeScript strict mode enabled.

---

## 3. Folder / File Tree

```
euzun-github-io/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions deploy pipeline
├── .claude/
│   └── settings.local.json               # (existing)
├── public/
│   ├── cv/
│   │   ├── ErkamUzunAcademicCV2025.pdf   # (existing, move here)
│   │   └── euzunResume2026.pdf           # (existing, move here)
│   ├── fonts/                            # Self-hosted fonts (Inter, display font)
│   │   ├── inter-variable.woff2
│   │   └── display-font.woff2            # Fraunces or Space Grotesk
│   ├── images/
│   │   ├── avatar.jpg                    # erkam-avatar-original.jpg (move here)
│   │   └── og-default.png               # 1200×630 fallback OG image
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── content/
│   │   ├── config.ts                     # All collection schema definitions
│   │   ├── posts/                        # Blog post MDX files
│   │   │   ├── 2024-pqc-overview.mdx
│   │   │   └── 2025-agentic-ai-framework.mdx
│   │   ├── publications/                 # One JSON or YAML per pub (or single file)
│   │   │   └── publications.json         # Array of all publications
│   │   ├── patents/
│   │   │   └── patents.json              # Array of all 6 patents
│   │   ├── projects/
│   │   │   ├── tiktok-passkey.mdx
│   │   │   ├── idme-agentic-ai.mdx
│   │   │   ├── idme-auth-replatform.mdx
│   │   │   ├── flpsi-fuzzy-psi.mdx
│   │   │   ├── rtcaptcha.mdx
│   │   │   ├── jpgscraper.mdx
│   │   │   └── privacy-biometric-auth.mdx
│   │   └── talks/                        # Optional v1.1
│   │       └── .gitkeep
│   ├── pages/
│   │   ├── index.astro                   # Homepage — recent posts feed + hero
│   │   ├── about.astro                   # Bio, role, education, links
│   │   ├── blog/
│   │   │   ├── index.astro               # Full post archive with filters
│   │   │   └── [slug].astro             # Single post page
│   │   ├── research/
│   │   │   └── index.astro              # Publications grouped by year
│   │   ├── patents/
│   │   │   └── index.astro              # Patent list
│   │   ├── projects/
│   │   │   ├── index.astro              # Project cards grid
│   │   │   └── [slug].astro            # Single project page
│   │   ├── cv/
│   │   │   └── index.astro             # On-page CV summary + PDF download
│   │   ├── talks/
│   │   │   └── index.astro             # Stub (v1.1)
│   │   ├── rss.xml.ts                  # RSS feed endpoint
│   │   ├── 404.astro                   # Custom 404 page
│   │   └── [...path].astro             # Optional catch-all for pagefind assets
│   ├── components/
│   │   ├── head/
│   │   │   └── BaseHead.astro          # <head> meta, fonts, OG tags
│   │   ├── layout/
│   │   │   ├── Header.astro            # Sticky nav + theme toggle + search
│   │   │   ├── Footer.astro            # Links, RSS, copyright
│   │   │   └── SkipLink.astro          # Accessibility skip-to-content
│   │   ├── ui/
│   │   │   ├── ThemeToggle.astro       # Sun/moon toggle, persists to localStorage
│   │   │   ├── CategoryPill.astro      # Colored category label
│   │   │   ├── VenueBadge.astro        # Conference/journal badge
│   │   │   ├── CopyButton.astro        # Copy code button (Astro island)
│   │   │   ├── SearchPalette.astro     # cmd+k pagefind overlay (island)
│   │   │   ├── BibTexModal.astro       # BibTeX copy modal (island)
│   │   │   └── Callout.astro           # Info/warning/tip/danger callout for MDX
│   │   ├── blog/
│   │   │   ├── PostCard.astro          # Card used on / and /blog
│   │   │   ├── TOC.astro               # Table of contents (sticky desktop)
│   │   │   ├── PostNav.astro           # Previous / next post navigation
│   │   │   └── ReadingProgress.astro   # Subtle scroll-progress bar (island)
│   │   ├── research/
│   │   │   └── PubEntry.astro          # Single publication row
│   │   ├── patents/
│   │   │   └── PatentEntry.astro       # Single patent row
│   │   └── projects/
│   │       └── ProjectCard.astro       # Project card with hero, role, tech chips
│   ├── layouts/
│   │   ├── BaseLayout.astro            # HTML shell, BaseHead, Header, Footer, SkipLink
│   │   ├── BlogLayout.astro            # BaseLayout + TOC + prose container
│   │   └── ProjectLayout.astro         # BaseLayout + project hero + content
│   ├── styles/
│   │   └── global.css                  # @import tailwindcss; @theme tokens; base resets
│   ├── lib/
│   │   ├── utils.ts                    # Shared utilities (formatDate, slugify, readTime)
│   │   ├── constants.ts               # SITE_TITLE, SITE_URL, AUTHOR, profile links
│   │   └── search.ts                  # Pagefind UI init helper
│   └── env.d.ts                       # Astro type augmentation
├── astro.config.mjs                    # Astro 5 config
├── tsconfig.json                       # TypeScript config (strict)
├── package.json
├── pnpm-lock.yaml
├── .gitignore
├── .prettierrc                         # Code formatting
├── DESIGN.md                           # This document
└── README.md                           # Dev setup instructions
```

**Notes on structure:**
- `publications.json` and `patents.json` use Astro's Content Layer JSON loader (Astro 5 feature). No individual `.mdx` file per publication needed since they don't have long-form content. Projects DO use `.mdx` because they have rich `longDescription` body.
- Fonts are self-hosted in `/public/fonts/` for performance (no third-party font network round-trips). Preloaded via `<link rel="preload">` in BaseHead.
- PDFs move to `/public/cv/` and `/public/files/` so they're served at clean paths.

---

## 4. Content Collection Schemas

File: `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

// ─── Blog Posts ───────────────────────────────────────────────────────────────

const CategoryEnum = z.enum([
  'research',    // Paper announcements, technical deep-dives on published work
  'engineering', // Production tooling, system design, industry war stories
  'agents',      // Agentic AI, Claude Code, multi-agent systems
  'crypto',      // Post-quantum, ZKP, MPC, PSI, FHE, privacy-preserving
  'opinion',     // Takes, retrospectives, career thoughts
  'talk',        // Conference talks written up as posts
  'award',       // Best paper, fellowships, recognitions (blog-style announcements)
  'life',        // Personal, non-technical
]);

const postsCollection = defineCollection({
  type: 'content', // MDX files
  schema: z.object({
    // Required
    title: z.string(),
    // e.g. "An introduction to Fuzzy Private Set Intersection"
    description: z.string(),
    // Used for OG description and post excerpt on cards. 1–2 sentences.
    pubDate: z.coerce.date(),
    // ISO 8601. Used for sorting and display. e.g. 2025-03-15
    category: CategoryEnum,

    // Optional
    updatedDate: z.coerce.date().optional(),
    // If the post was substantially revised after publication.

    tags: z.array(z.string()).default([]),
    // Free-form lowercase tags. e.g. ["pqc", "zkp", "lattices", "rust"]

    heroImage: z.string().optional(),
    // Relative path from the post file, or absolute /images/... path.
    // Optional. If omitted, post card shows category pill only.

    draft: z.boolean().default(false),
    // If true, excluded from build in production. Visible in dev.

    readTime: z.number().int().positive().optional(),
    // Override auto-calculated read time (minutes). Normally computed from word count.

    math: z.boolean().default(false),
    // Opt-in KaTeX rendering. When true, remark-math + rehype-katex are applied
    // and KaTeX CSS is injected via BlogLayout. Keeping this opt-in avoids loading
    // KaTeX CSS on non-math posts (saves ~80KB per non-math page).

    featured: z.boolean().default(false),
    // Pin to top of homepage feed if true.

    relatedProject: z.string().optional(),
    // Slug of a project in the projects collection. Renders a "Related Project" card.
  }),
});

// ─── Publications ─────────────────────────────────────────────────────────────

const VenueTypeEnum = z.enum([
  'conference', // ACM CCS, IEEE S&P, USENIX Security, NDSS, etc.
  'journal',    // IEEE TIFS, ACM TOPS, etc.
  'workshop',   // Co-located workshops
  'magazine',   // IEEE Security & Privacy magazine, CACM, etc.
  'preprint',   // arXiv, IACR ePrint
]);

const publicationsCollection = defineCollection({
  type: 'data', // JSON / YAML, not MDX
  schema: z.object({
    // Required
    id: z.string(),
    // Unique identifier. Lowercase-hyphenated. e.g. "flpsi-2023"

    title: z.string(),
    // Full paper title.

    authors: z.array(z.object({
      name: z.string(),
      // Display name. e.g. "Erkam Uzun"
      isErkam: z.boolean().default(false),
      // When true, name is rendered in bold on the publications page.
      url: z.string().url().optional(),
      // Optional link to author's personal page.
    })),
    // Author list in publication order.

    venue: z.string(),
    // Short venue name. e.g. "ACM CCS", "IEEE S&P", "USENIX Security 2023"

    venueType: VenueTypeEnum,

    year: z.number().int().min(2000).max(2030),

    bibtex: z.string(),
    // Raw BibTeX string for the BibTeX modal copy button.

    // Optional
    abstract: z.string().optional(),
    // Shown on expand. Plain text or light markdown.

    pdfUrl: z.string().url().optional(),
    // Direct PDF link (ACM DL, IEEE Xplore, arXiv, author's copy).

    codeUrl: z.string().url().optional(),
    // GitHub or artifact link.

    slidesUrl: z.string().url().optional(),
    // Slides PDF or speaker deck.

    doi: z.string().optional(),
    // e.g. "10.1145/3576915.3616579". Rendered as doi.org link.

    selected: z.boolean().default(false),
    // If true, shown in the "Selected" filter view. Flagship papers.

    projectSlug: z.string().optional(),
    // Links to a project entry. e.g. "flpsi-fuzzy-psi"

    citationCount: z.number().int().nonnegative().optional(),
    // Manually maintained citation count. Displayed as a soft metric.
    // Rationale: Scholar has no official API; scraping is fragile.
    // Recommendation: update manually at quarter-end or when writing new posts.

    awardNote: z.string().optional(),
    // e.g. "Best Paper Award", "Distinguished Paper". Shown as a badge.
  }),
});

// ─── Patents ──────────────────────────────────────────────────────────────────

const patentsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // Required
    number: z.string(),
    // USPTO patent number with kind code. e.g. "US11874911B2"

    title: z.string(),

    assignee: z.string(),
    // e.g. "Microsoft Corporation", "ID.me, Inc."

    year: z.number().int().min(2010).max(2030),
    // Grant year.

    url: z.string().url(),
    // Google Patents or USPTO link.

    // Optional
    projectSlug: z.string().optional(),
    // Links patent to a project.

    inventors: z.array(z.string()).optional(),
    // Inventor name list. Erkam should be highlighted.

    abstract: z.string().optional(),
    // Short abstract from patent. Shown on expand if desired.
  }),
});

// ─── Projects ─────────────────────────────────────────────────────────────────

const projectsCollection = defineCollection({
  type: 'content', // MDX — projects have rich long descriptions
  schema: z.object({
    // Required
    name: z.string(),
    // Display name. e.g. "TikTok Passkey"

    shortDescription: z.string(),
    // 1–2 sentences for card subtitle. e.g. "Shipped passkey auth to 100M+ users..."

    role: z.string(),
    // e.g. "Tech Lead", "Primary Researcher", "Core Engineer"

    org: z.string(),
    // Organization. e.g. "TikTok", "ID.me", "Georgia Tech"

    tech: z.array(z.string()),
    // Technology/tool names for chips. e.g. ["WebAuthn", "FIDO2", "Kotlin", "React"]

    yearStart: z.number().int().min(2000).max(2030),

    // Optional
    yearEnd: z.number().int().min(2000).max(2030).optional(),
    // Omit if ongoing.

    hero: z.string().optional(),
    // Path to hero image for project page and card.

    featured: z.boolean().default(false),
    // Featured projects appear first and larger on /projects.

    links: z.object({
      paper: z.string().url().optional(),
      code: z.string().url().optional(),
      demo: z.string().url().optional(),
      post: z.string().optional(),
      // Internal slug e.g. "/blog/idme-agentic-ai-framework"
    }).default({}),

    relatedPublications: z.array(z.string()).optional(),
    // Array of publication IDs. e.g. ["flpsi-2023", "rtcaptcha-2022"]
  }),
});

// ─── Talks (Optional, v1.1) ───────────────────────────────────────────────────

const talksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    eventUrl: z.string().url().optional(),
    date: z.coerce.date(),
    location: z.string().optional(),
    // e.g. "San Francisco, CA" or "Virtual"
    slidesUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    abstract: z.string().optional(),
    relatedPublication: z.string().optional(),
  }),
});

// ─── Export all collections ───────────────────────────────────────────────────

export const collections = {
  posts: postsCollection,
  publications: publicationsCollection,
  patents: patentsCollection,
  projects: projectsCollection,
  talks: talksCollection,
};
```

**Schema notes:**
- `publications.json` is a single JSON array (not one file per pub). Astro's Content Layer will validate each item against the schema.
- The `math` field on posts allows per-post KaTeX opt-in, avoiding 80KB+ KaTeX CSS on every post.
- `selected` on publications powers the "Selected Works" filter on `/research` — curate ~5–8 flagship papers here.
- `citationCount` is intentionally manually maintained. The reasoning: Google Scholar's unofficial APIs are unreliable and violate ToS. A manual quarterly update of 20 entries takes < 5 minutes.

---

## 5. Page Wireframes

All wireframes are mobile-first (320px base). Desktop notes added where layout differs.

### 5.1 Homepage `/`

```
┌────────────────────────────────────────────────────────────────┐
│ [Skip to content]                                               │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ HEADER (sticky, height: 56px)                             │   │
│ │ [Logo: "EU"] [nav: About Blog Research Patents Projects CV]│   │
│ │                              [search icon] [theme toggle] │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ HERO (full-width, accent-tinted bg or no bg)             │   │
│ │                                                           │   │
│ │  [avatar — 80px circle, optional]  Erkam Uzun            │   │
│ │                                   [display font, 3xl]    │   │
│ │                                                           │   │
│ │  Staff SWE + Tech Lead @ ID.me · Mountain View, CA       │   │
│ │                                                           │   │
│ │  I work at the intersection of applied cryptography,     │   │
│ │  privacy-preserving systems, and large-scale identity     │   │
│ │  infrastructure. PhD from Georgia Tech (advisor: Wenke   │   │
│ │  Lee). Currently building agentic AI systems at ID.me.   │   │
│ │                                                           │   │
│ │  [Scholar ↗] [GitHub ↗] [LinkedIn ↗] [Email ↗]          │   │
│ │                                                           │   │
│ │  ──────────────────────────────────────────────────────  │   │
│ │                                                           │   │
│ │  6 patents   ·   20+ papers   ·   500+ citations   ·  h-index 12  │
│ │  [muted subtext, monospace or tabular numbers]           │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Recent Posts                        [→ All posts]              │
│                                                                 │
│  [Category filter — horizontal scroll on mobile]               │
│  [All] [Research] [Engineering] [Agents] [Crypto] [Opinion]    │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │ [RESEARCH pill]  │  │ [ENGINEERING]    │  │ [AGENTS]    │  │
│  │ Mar 15, 2025     │  │ Jan 8, 2025      │  │ Nov 2024    │  │
│  │ Title of Post    │  │ Title of Post    │  │ Title       │  │
│  │ Excerpt text...  │  │ Excerpt text...  │  │ Excerpt...  │  │
│  │ 8 min read       │  │ 5 min read       │  │ 12 min read │  │
│  └──────────────────┘  └──────────────────┘  └─────────────┘  │
│                                                                 │
│  [grid continues — desktop: 3-col, tablet: 2-col, mobile: 1-col]│
│                                                                 │
│  [→ View all posts]                                            │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ FOOTER                                                    │   │
│ │ © 2026 Erkam Uzun · RSS · GitHub · LinkedIn · Scholar    │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Desktop: Hero is two-column if avatar is included (avatar left, text right).
         Post grid is 3 columns max-width 1200px, centered.
Mobile:  Hero is single column, avatar above text.
         Category pills scroll horizontally.
```

### 5.2 `/about`

```
┌──────────────────────────────────────────────────────────────┐
│ [Header]                                                      │
│                                                              │
│  About                        [65ch reading column, centered]│
│  ─────                                                       │
│                                                              │
│  [avatar — 120px circle, left-float on desktop]             │
│                                                              │
│  Erkam Uzun                                                  │
│  Staff Software Engineer & Tech Lead, ID.me                 │
│  Mountain View, CA                                          │
│                                                              │
│  [2–3 paragraph bio: background, PhD, current work,         │
│   research interests, what this site is for]                │
│                                                              │
│  ── Current Role ──────────────────────────────────────────  │
│  ID.me (2022 – present)                                     │
│  Staff SWE + Tech Lead                                      │
│  - Leading auth re-platforming (IAM scale)                  │
│  - Built agentic AI framework (24× productivity)            │
│                                                              │
│  ── Education ─────────────────────────────────────────────  │
│  PhD, Computer Science — Georgia Tech, 2021                 │
│  Advisor: Wenke Lee                                         │
│  Research: Applied cryptography, privacy-preserving         │
│  authentication, biometrics                                 │
│                                                              │
│  [MS/BS if applicable]                                      │
│                                                              │
│  ── Research Areas ────────────────────────────────────────  │
│  [tag chips: Post-Quantum Crypto, PSI, FHE, MPC, ZKP,      │
│   Biometric Auth, Agentic AI, IAM at Scale, WebAuthn]       │
│                                                              │
│  ── Expertise Stack ───────────────────────────────────────  │
│  [2-column list: Languages (Rust, Go, Kotlin, Python, JS),  │
│   Cryptography libs, Cloud (AWS, GCP), Frameworks, Tools]  │
│                                                              │
│  ── Profiles ──────────────────────────────────────────────  │
│  [Google Scholar ↗] [GitHub: euzun ↗] [LinkedIn ↗]        │
│  [ORCID ↗] [Email: erkamuzun@gmail.com]                    │
│                                                              │
│ [Footer]                                                     │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 `/research`

```
┌──────────────────────────────────────────────────────────────┐
│ [Header]                                                      │
│                                                              │
│  Publications                                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ METRICS BAR                                            │ │
│  │ h-index 12  ·  500+ citations  ·  20+ publications    │ │
│  │ [→ Google Scholar ↗]                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Filters:  [All ●] [Selected] [Conference] [Journal]        │
│            [Workshop] [Preprint]                            │
│                                                              │
│  ── 2024 ────────────────────────────────────────────────── │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [IEEE S&P badge] [SELECTED ★]    [Best Paper ✦]       │ │
│  │ Title of Paper One                                     │ │
│  │ **Erkam Uzun**, First Author, Co-Author 2, Co-Author 3 │ │
│  │ IEEE Symposium on Security & Privacy, 2024            │ │
│  │                                                        │ │
│  │ [PDF ↗] [BibTeX ⊞] [Code ↗] [Slides ↗] [DOI ↗]     │ │
│  │ [▼ Abstract]  ← expand/collapse                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [USENIX badge]                                         │ │
│  │ Title of Paper Two                                     │ │
│  │ Co-Author 1, **Erkam Uzun**, Co-Author 2               │ │
│  │ USENIX Security 2024                                   │ │
│  │ [PDF ↗] [BibTeX ⊞] [DOI ↗]                           │ │
│  │ [▼ Abstract]                                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ── 2023 ────────────────────────────────────────────────── │
│  [... more entries ...]                                     │
│                                                              │
│ [Footer]                                                     │
└──────────────────────────────────────────────────────────────┘

BibTeX Modal (overlay, triggered by [BibTeX ⊞]):
┌──────────────────────────────────────────────────────────────┐
│ BibTeX                                          [✕ Close]    │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ @inproceedings{uzun2024title,                            ││
│ │   author    = {Uzun, Erkam and ...},                     ││
│ │   title     = {{Title of Paper}},                        ││
│ │   booktitle = {IEEE S&P},                                ││
│ │   year      = {2024},                                    ││
│ │ }                                                        ││
│ └──────────────────────────────────────────────────────────┘│
│                              [Copy to clipboard ⊞]           │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 `/blog/[slug]` — Single Post

```
┌──────────────────────────────────────────────────────────────┐
│ [Header]                                                      │
│                                                              │
│  Blog > Crypto                          [copy-link button]   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ARTICLE (max-width: 65ch, centered)                  │    │
│  │                                                      │    │
│  │ [hero image — full article width if present]         │    │
│  │                                                      │    │
│  │ [CRYPTO pill]  ·  March 15, 2025  ·  8 min read     │    │
│  │                                                      │    │
│  │ # Post Title in Display Font                         │    │
│  │                                                      │    │
│  │ By Erkam Uzun                                        │    │
│  │                                                      │    │
│  │ [Reading progress bar — top of viewport, thin accent]│    │
│  │                                                      │    │
│  │ ── TABLE OF CONTENTS (sticky sidebar on desktop) ── │    │
│  │  On mobile: collapsible inline block above content  │    │
│  │  ## Contents                                        │    │
│  │  1. Introduction                                    │    │
│  │  2. Background: Lattice Cryptography                │    │
│  │  3. The FLPSI Construction                          │    │
│  │  4. Security Analysis                               │    │
│  │  5. Implementation Results                          │    │
│  │                                                     │    │
│  │ ── PROSE CONTENT ──────────────────────────────────  │    │
│  │                                                      │    │
│  │ Introduction paragraph text...                       │    │
│  │                                                      │    │
│  │ ┌─────────────────────────────────────────────────┐ │    │
│  │ │ [CALLOUT: info]                                 │ │    │
│  │ │ This post assumes familiarity with lattice-based│ │    │
│  │ │ cryptography. See [background post] for primer. │ │    │
│  │ └─────────────────────────────────────────────────┘ │    │
│  │                                                      │    │
│  │  Inline math: $\mathcal{L}_{q}^n$ renders here      │    │
│  │                                                      │    │
│  │  Display math:                                       │    │
│  │  $$\text{RLWE}: (\mathbf{a}, \mathbf{b}) \text{ where} \mathbf{b} = \mathbf{a} \cdot \mathbf{s} + \mathbf{e}$$ │
│  │                                                      │    │
│  │ ```rust                          [Copy ⊞]           │    │
│  │ fn lwe_encrypt(pk: &PublicKey,   ──────────────────  │    │
│  │   msg: &[u8]) -> Ciphertext {                       │    │
│  │   // Shiki-highlighted                              │    │
│  │ }                                                   │    │
│  │ ```                                                  │    │
│  │                                                      │    │
│  │ [footnote reference¹]                               │    │
│  │                                                      │    │
│  │ ── TAGS ──────────────────────────────────────────  │    │
│  │ #pqc  #rlwe  #lattices  #cryptography               │    │
│  │                                                      │    │
│  │ ── FOOTNOTES ──────────────────────────────────────  │    │
│  │ ¹ Footnote text here.                               │    │
│  │                                                      │    │
│  │ [copy-link button]  [← Share]                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ PREVIOUS / NEXT NAV                                  │    │
│  │ ← Previous: [Post Title]   [Post Title] → Next      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│ [Footer]                                                     │
└──────────────────────────────────────────────────────────────┘

Desktop: TOC floats as a sticky sidebar to the right of the 65ch article column.
Mobile: TOC is a collapsible <details> element above the first heading.
```

### 5.5 `/projects`

```
┌──────────────────────────────────────────────────────────────┐
│ [Header]                                                      │
│                                                              │
│  Projects                                                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ FEATURED (larger card, full-width on mobile)           │ │
│  │                                                        │ │
│  │ [hero image — 16:9 ratio]                              │ │
│  │ TikTok Passkey                           [FEATURED]   │ │
│  │ Tech Lead · TikTok · 2022–2023                        │ │
│  │ Shipped FIDO2/WebAuthn passkey auth to 100M+ users... │ │
│  │ [WebAuthn] [FIDO2] [Kotlin] [React]  (tech chips)     │ │
│  │ [Paper ↗] [Post ↗]                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ ID.me Agentic AI │  │ ID.me Auth        │                 │
│  │ Tech Lead · ID.me│  │ Replatform        │                 │
│  │ 2024–present     │  │ Tech Lead · ID.me │                 │
│  │                  │  │ 2023–present      │                 │
│  │ [description]    │  │ [description]     │                 │
│  │ [Claude] [MCP]   │  │ [Go] [Kubernetes] │                 │
│  │ [Post ↗]         │  │ [Post ↗]          │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │ FLPSI / FuzzyPSI │  │ rtCaptcha        │  │JpgScraper │  │
│  │ Researcher · GT  │  │ Researcher · GT  │  │ Researcher│  │
│  │ ...              │  │ ...              │  │ ...       │  │
│  └──────────────────┘  └──────────────────┘  └───────────┘  │
│                                                              │
│ [Footer]                                                     │
└──────────────────────────────────────────────────────────────┘

Desktop: Featured project is full-width hero card. Grid below is 2-col then 3-col.
Click on any card → /projects/[slug] with full MDX content.
```

### 5.6 `/patents`

```
┌──────────────────────────────────────────────────────────────┐
│ [Header]                                                      │
│                                                              │
│  USPTO Patents                        6 granted patents       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ US11874911B2 · 2024                                    │ │
│  │ [Patent Title Here]                                    │ │
│  │ Assignee: ID.me, Inc.                                  │ │
│  │ [→ Google Patents ↗] [→ USPTO ↗]                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ US11XXX · 2023                                         │ │
│  │ [Patent Title]                                         │ │
│  │ Assignee: Microsoft Corporation                        │ │
│  │ [→ Google Patents ↗]                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [... 4 more patent entries ...]                            │
│                                                              │
│  ── Note ──────────────────────────────────────────────────  │
│  All patents are granted by the United States Patent and   │ │
│  Trademark Office (USPTO).                                  │
│                                                              │
│ [Footer]                                                     │
└──────────────────────────────────────────────────────────────┘

Layout: Clean list, no grid needed. Each entry is a bordered card/row.
Sorted: newest grant year first.
```

---

## 6. Component Inventory

### 6.1 Head / Meta

**`BaseHead.astro`**
- Props: `title: string`, `description: string`, `image?: string`, `pubDate?: Date`
- Renders: `<title>`, `<meta description>`, OG tags (og:title, og:description, og:image, og:type, og:url), Twitter Card tags, canonical URL, font preloads, favicon links, KaTeX CSS link (conditionally injected by BlogLayout when `math: true`)
- No JavaScript

---

### 6.2 Layout Components

**`BaseLayout.astro`**
- Props: `title: string`, `description: string`, `image?: string`
- Wraps: `SkipLink` → `BaseHead` → `Header` → `<main id="content">` (slot) → `Footer`
- Applies base `<html>` class strategy for dark mode

**`BlogLayout.astro`**
- Extends: `BaseLayout`
- Props: all BaseLayout props + `post: CollectionEntry<'posts'>` + `headings: MarkdownHeading[]`
- Wraps article in 65ch prose container; conditionally injects KaTeX CSS; renders `TOC` as sticky sidebar (desktop) or collapsible block (mobile); renders `ReadingProgress`

**`ProjectLayout.astro`**
- Extends: `BaseLayout`
- Props: all BaseLayout props + `project: CollectionEntry<'projects'>`
- Renders project hero image, metadata row, MDX body in `prose` container

**`Header.astro`**
- Props: none (reads current URL via `Astro.url`)
- Renders: logo ("EU" text or SVG monogram), nav links with active-state styling, `ThemeToggle`, `SearchPalette` trigger button (icon + "⌘K" hint on desktop)
- Sticky via `position: sticky; top: 0; z-index: 50`
- Backdrop blur on scroll (JS island — `client:load` with tiny scroll listener)

**`Footer.astro`**
- Props: none
- Renders: copyright, links to RSS, GitHub, LinkedIn, Scholar

**`SkipLink.astro`**
- Props: none
- Renders: visually hidden "Skip to main content" link, shown on focus, points to `#content`

---

### 6.3 UI Primitives

**`ThemeToggle.astro`**
- Props: none
- Client island (`client:load`)
- On mount: reads `localStorage.theme` or `prefers-color-scheme`. Sets `class="dark"` on `<html>`.
- On click: toggles, persists to `localStorage`. No FOUC because a tiny inline `<script>` in `BaseHead` sets the class synchronously before paint.
- ARIA: `aria-label="Toggle dark mode"`, `aria-pressed={isDark}`

**`CategoryPill.astro`**
- Props: `category: CategoryEnum`
- Renders: styled `<span>` with category-specific accent color mapping
- Color map:
  - research → indigo/teal (accent)
  - engineering → emerald
  - agents → violet
  - crypto → amber/gold
  - opinion → sky
  - talk → rose
  - award → yellow
  - life → neutral

**`VenueBadge.astro`**
- Props: `venue: string`, `venueType: VenueTypeEnum`
- Renders: monospace-ish small badge with border. Color by type:
  - conference → accent color border
  - journal → green border
  - workshop → orange border
  - preprint → gray border

**`CopyButton.astro`**
- Props: none (operates on sibling `<pre>` via JS)
- Client island (`client:visible`)
- Renders: small clipboard icon button absolutely positioned inside code block
- On click: copies `pre.textContent`, shows "Copied!" for 2s, reverts

**`SearchPalette.astro`**
- Props: none
- Client island (`client:load`)
- Renders: hidden overlay, triggered by header button or `⌘K` / `Ctrl+K`
- Uses pagefind's JS UI (`new PagefindUI({ element: '#search' })`)
- Trap focus when open. `Escape` closes.
- ARIA: `role="dialog"`, `aria-modal="true"`, `aria-label="Site search"`

**`BibTexModal.astro`**
- Props: `bibtex: string`, `paperId: string`
- Client island (`client:visible`)
- Renders: trigger button "BibTeX" → modal overlay with `<pre>` block + copy button
- Focus trap, Escape closes, click-outside closes
- ARIA: `role="dialog"`, `aria-modal="true"`

**`Callout.astro`**
- Props: `type: 'info' | 'warning' | 'tip' | 'danger'`, slot for content
- MDX usage: `<Callout type="info">Content here</Callout>`
- Renders: colored left-border box with icon (ℹ️ / ⚠️ / 💡 / 🚫 — or SVG icons)
- Actually: use SVG icons, not emoji, for accessibility

---

### 6.4 Blog Components

**`PostCard.astro`**
- Props: `post: CollectionEntry<'posts'>`, `compact?: boolean`
- Renders: `CategoryPill`, date, title (linked), excerpt (from `description`), read-time badge
- Hover: subtle lift (translate-y + shadow transition)
- No image shown by default in card (reduces visual clutter). Hero image shown only in full post.

**`TOC.astro`**
- Props: `headings: MarkdownHeading[]` (from `getHeadings()`)
- Renders: ordered list of H2/H3 links
- Client island (`client:load`): highlights active heading on scroll via IntersectionObserver
- Desktop: renders as sticky sidebar via CSS grid in BlogLayout
- Mobile: renders as `<details>/<summary>` collapsible before article content

**`PostNav.astro`**
- Props: `prev?: CollectionEntry<'posts'>`, `next?: CollectionEntry<'posts'>`
- Renders: two-column flex row with ← previous and next → cards
- Falls back gracefully when at first/last post

**`ReadingProgress.astro`**
- Props: none
- Client island (`client:load`)
- Renders: 2px tall accent-colored `<div>` fixed at top of viewport
- `width` driven by `(scrollY / (docHeight - windowHeight)) * 100` %

---

### 6.5 Research Components

**`PubEntry.astro`**
- Props: `pub: CollectionEntry<'publications'>`
- Renders: `VenueBadge`, selected star, award badge, title, author list (Erkam bolded), venue + year, action links ([PDF] [BibTeX] [Code] [Slides] [DOI]), expandable abstract via `<details>`

---

### 6.6 Patent Components

**`PatentEntry.astro`**
- Props: `patent: CollectionEntry<'patents'>`
- Renders: patent number (monospace), title, assignee, year, external links

---

### 6.7 Project Components

**`ProjectCard.astro`**
- Props: `project: CollectionEntry<'projects'>`, `featured?: boolean`
- Renders: optional hero image, project name, role + org + years, short description, tech chips (small pills), links row
- Featured variant: larger card, full description visible

---

## 7. Design Tokens

Implemented in `src/styles/global.css` using Tailwind v4's `@theme` directive. This produces CSS custom properties consumed throughout.

```css
/* src/styles/global.css */

@import "tailwindcss";
@import "@tailwindcss/typography";

@theme {
  /* ── Typography Scale ────────────────────────────── */
  --font-size-xs:   0.75rem;    /* 12px */
  --font-size-sm:   0.875rem;   /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg:   1.125rem;   /* 18px */
  --font-size-xl:   1.25rem;    /* 20px */
  --font-size-2xl:  1.5rem;     /* 24px */
  --font-size-3xl:  1.875rem;   /* 30px */
  --font-size-4xl:  2.25rem;    /* 36px */
  --font-size-5xl:  3rem;       /* 48px */
  --font-size-6xl:  3.75rem;    /* 60px — hero only */

  /* ── Line Heights ────────────────────────────────── */
  --line-height-tight:  1.25;
  --line-height-snug:   1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.65;  /* prose default */
  --line-height-loose:  2;

  /* ── Font Families ───────────────────────────────── */
  --font-display: "Fraunces", serif;    /* Option A — OR — */
  /* --font-display: "Space Grotesk", sans-serif; */  /* Option B */
  --font-body:    "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "Fira Code", ui-monospace, monospace;

  /* ── Spacing ─────────────────────────────────────── */
  /* Using Tailwind v4's default 4px base (--spacing-1 = 4px). */
  /* Custom named spacing: */
  --spacing-section: 5rem;    /* 80px — between major page sections */
  --spacing-prose:   1.75rem; /* paragraph spacing in articles */

  /* ── Reading Width ───────────────────────────────── */
  --measure-prose:  65ch;    /* max-width for article body */
  --measure-wide:   80ch;    /* wider containers (research entries) */

  /* ── Border Radius ───────────────────────────────── */
  --radius-sm:   0.25rem;  /* 4px  — chips, badges */
  --radius-md:   0.5rem;   /* 8px  — cards */
  --radius-lg:   0.75rem;  /* 12px — modals, large cards */
  --radius-full: 9999px;   /* pills, avatar */

  /* ── Shadows ─────────────────────────────────────── */
  --shadow-card:  0 1px 3px oklch(0 0 0 / 0.08), 0 1px 2px oklch(0 0 0 / 0.06);
  --shadow-hover: 0 4px 12px oklch(0 0 0 / 0.10), 0 2px 4px oklch(0 0 0 / 0.08);
  --shadow-modal: 0 20px 60px oklch(0 0 0 / 0.20);

  /* ── Transitions ─────────────────────────────────── */
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;

  /* ── Z-Index Scale ───────────────────────────────── */
  --z-header: 50;
  --z-overlay: 100;
  --z-modal:   200;
  --z-toast:   300;
}

/* ── Light Mode Color Tokens ─────────────────────────────────── */
:root {
  --color-bg:           oklch(0.99 0 0);     /* near white #fafafa */
  --color-surface:      oklch(0.97 0 0);     /* gray-50 */
  --color-surface-2:    oklch(0.94 0 0);     /* gray-100 */
  --color-border:       oklch(0.91 0 0);     /* gray-200 */
  --color-border-2:     oklch(0.85 0 0);     /* gray-300 — stronger borders */
  --color-text:         oklch(0.15 0 0);     /* gray-900 */
  --color-text-muted:   oklch(0.45 0 0);     /* gray-500 */
  --color-text-subtle:  oklch(0.62 0 0);     /* gray-400 */

  /* Accent — swap this block for Option B (Teal) */
  /* Option A: Indigo */
  --color-accent:       oklch(0.60 0.22 264);  /* indigo-600 */
  --color-accent-hover: oklch(0.54 0.22 264);  /* indigo-700 */
  --color-accent-muted: oklch(0.94 0.05 264);  /* indigo-50 */
  --color-accent-text:  oklch(0.60 0.22 264);  /* for text links */

  /* Code block bg */
  --color-code-bg:      oklch(0.97 0 0);
}

/* ── Dark Mode Color Tokens ──────────────────────────────────── */
.dark {
  --color-bg:           oklch(0.11 0 0);     /* gray-950 — true dark */
  --color-surface:      oklch(0.16 0 0);     /* gray-900 */
  --color-surface-2:    oklch(0.21 0 0);     /* gray-800 */
  --color-border:       oklch(0.27 0 0);     /* gray-700 */
  --color-border-2:     oklch(0.33 0 0);     /* gray-600 */
  --color-text:         oklch(0.96 0 0);     /* gray-50 */
  --color-text-muted:   oklch(0.70 0 0);     /* gray-400 */
  --color-text-subtle:  oklch(0.55 0 0);     /* gray-500 */

  /* Option A: Indigo (brighter in dark mode) */
  --color-accent:       oklch(0.70 0.18 264);  /* indigo-400 */
  --color-accent-hover: oklch(0.76 0.18 264);  /* indigo-300 */
  --color-accent-muted: oklch(0.20 0.06 264);  /* dark indigo surface */
  --color-accent-text:  oklch(0.72 0.18 264);

  --color-code-bg:      oklch(0.14 0 0);
}
```

**Category color tokens** (injected in CategoryPill.astro via inline style or data-attribute):

| Category   | Light bg              | Light text            | Dark bg               | Dark text             |
|---|---|---|---|---|
| research   | `accent-muted`        | `accent`              | `accent-muted`        | `accent`              |
| engineering| `emerald-50`          | `emerald-700`         | `emerald-950`         | `emerald-400`         |
| agents     | `violet-50`           | `violet-700`          | `violet-950`          | `violet-400`          |
| crypto     | `amber-50`            | `amber-700`           | `amber-950`           | `amber-400`           |
| opinion    | `sky-50`              | `sky-700`             | `sky-950`             | `sky-400`             |
| talk       | `rose-50`             | `rose-700`            | `rose-950`            | `rose-400`            |
| award      | `yellow-50`           | `yellow-700`          | `yellow-950`          | `yellow-400`          |
| life       | `gray-100`            | `gray-600`            | `gray-800`            | `gray-400`            |

---

## 8. Typography Proposals (Pick One)

### Option A: Fraunces + Inter — "Scholarly Editorial"

```
Display / Headings:  Fraunces (variable, Google Fonts / self-hosted)
                     A quirky optical-size variable serif. Used by many
                     high-quality editorial and academic sites. Warm,
                     distinctive, signals depth of thought.

Body:                Inter (variable, Google Fonts / self-hosted)
                     The standard for readable UI text. Excellent at
                     all sizes. Pairs cleanly with a display serif.

Mono:                JetBrains Mono
                     Top-tier developer font, excellent ligatures,
                     ideal for code-heavy crypto/engineering content.
```

**Visual character:** The contrast between the curved, optically-adaptive Fraunces headings and the clean Inter body creates a "serious academic journal that knows good design." Feels right for someone who publishes in IEEE S&P and USENIX.

```
H1 (hero):    Fraunces 400 · 3.75rem / 1.1 · tracking: -0.02em
H2:           Fraunces 400 · 1.875rem / 1.25
H3:           Inter 600 · 1.25rem / 1.35 (switch to sans for lower headings)
Body:         Inter 400 · 1rem / 1.65
Caption/meta: Inter 400 · 0.875rem / 1.5 · color: text-muted
Code:         JetBrains Mono 400 · 0.875rem / 1.6
```

**Self-hosting:** Download from Google Fonts as variable `.woff2`. One file for each. Zero external font network requests after initial load.

---

### Option B: Space Grotesk + Inter — "Technical Modernist"

```
Display / Headings:  Space Grotesk (variable, Google Fonts / self-hosted)
                     A geometric grotesque with personality. Used widely
                     in crypto/web3/AI startups and technical blogs.
                     More contemporary, less academic than a serif.

Body:                Inter (same as Option A)

Mono:                JetBrains Mono (same as Option A)
```

**Visual character:** All-sans typography with differentiated weight and optical character. Feels like the websites of high-quality engineering blogs (Cloudflare, Linear, Vercel). More "tech company" than "research lab."

```
H1 (hero):    Space Grotesk 700 · 3.75rem / 1.05 · tracking: -0.03em
H2:           Space Grotesk 600 · 1.875rem / 1.2
H3:           Space Grotesk 600 · 1.25rem / 1.3
Body:         Inter 400 · 1rem / 1.65
Caption/meta: Inter 400 · 0.875rem / 1.5 · color: text-muted
Code:         JetBrains Mono 400 · 0.875rem / 1.6
```

**Recommendation:** If the goal is to project researcher/academic identity → **Option A (Fraunces)**. If the goal is to project senior engineer / tech leader identity → **Option B (Space Grotesk)**. Given Erkam's dual identity (PhD researcher + Staff SWE at ID.me), Option A may have the slight edge — the serif headline differentiates from generic engineering blogs while staying tasteful.

---

## 9. Accent Color Proposals (Pick One)

### Option A: Indigo — "Confident Technical Authority"

```
Light:  oklch(0.60 0.22 264)  ≈ #4f46e5 (indigo-600)
Dark:   oklch(0.70 0.18 264)  ≈ #818cf8 (indigo-400)
```

**Character:** The canonical "serious tech" color. Used by Tailwind's own docs, Linear, Notion. Slightly purple-adjacent — echoes academic/research associations. High contrast in both light and dark mode against neutral gray backgrounds. Pairs naturally with the entire Tailwind color system.

**Works well for:** Links, active nav, category pills (research), CTA buttons, focus rings, reading progress bar.

---

### Option B: Teal — "Privacy-Forward Identity"

```
Light:  oklch(0.55 0.14 175)  ≈ #0d9488 (teal-600)
Dark:   oklch(0.68 0.12 175)  ≈ #2dd4bf (teal-400)
```

**Character:** Teal is semantically aligned with privacy, trust, and security — perfectly on-brand for someone whose primary research domain is privacy-preserving cryptography (PSI, FHE, ZKP, PQC). It's less common than indigo in personal sites, making it more distinctive. Still professional, not cold.

**Works well for:** All the same uses as Indigo. Teal-on-dark is particularly striking.

**Recommendation:** **Option B (Teal)** is slightly stronger for Erkam's brand because it carries semantic meaning (privacy/security/trust) that reinforces his expertise domain. Indigo is safe and beautiful but is also "everyone's color." Teal stakes a more distinctive claim.

If Teal feels too bold against some content, a mid-range option: `oklch(0.57 0.15 218)` (a cyan-blue) splits the difference.

---

## 10. SEO and Social Strategy

### Per-Page Meta

| Page | `<title>` pattern | `og:type` | Notes |
|---|---|---|---|
| `/` | `Erkam Uzun — Applied Cryptography & Systems` | `website` | — |
| `/about` | `About · Erkam Uzun` | `profile` | `profile:first_name`, `profile:last_name` |
| `/blog` | `Blog · Erkam Uzun` | `website` | — |
| `/blog/[slug]` | `{Post Title} · Erkam Uzun` | `article` | `article:published_time`, `article:tag` |
| `/research` | `Publications · Erkam Uzun` | `website` | — |
| `/patents` | `Patents · Erkam Uzun` | `website` | — |
| `/projects` | `Projects · Erkam Uzun` | `website` | — |
| `/projects/[slug]` | `{Project Name} · Erkam Uzun` | `website` | — |
| `/cv` | `CV · Erkam Uzun` | `website` | — |

`<title>` max: 60 chars. `description` max: 155 chars. Both from frontmatter for posts/projects.

### OpenGraph Image Strategy

**v1 (Static):**
- Default OG image: `/public/og-default.png` — 1200×630px, generated manually once.
  - Content: dark background, "Erkam Uzun" in display font, title + role below, subtle accent color bar
- All pages use this default unless overridden by `heroImage` frontmatter

**v1.1 (Dynamic — optional upgrade):**
- Use `satori` + `@resvg-rs/resvg-wasm` at build time to generate per-post OG images
- Template: post title (truncated to 2 lines) + date + category pill + author name/photo
- Stored to `/public/og/[slug].png` at build time
- Adds ~5s to build. Worth it for posts with high shareability

### Sitemap

`@astrojs/sitemap` is configured in `astro.config.mjs`. It auto-discovers all static pages. Add `changefreq` and `priority` hints:
- `/`: priority 1.0
- `/blog`, `/research`, `/projects`: priority 0.9
- Individual posts/projects: priority 0.8
- `/about`, `/cv`, `/patents`: priority 0.7

### RSS Feed

`src/pages/rss.xml.ts` — uses `@astrojs/rss`. Publishes all non-draft posts with title, description, pubDate, and link. Feed URL: `https://euzun.github.io/rss.xml`. Add `<link rel="alternate" type="application/rss+xml">` in `BaseHead`.

### JSON-LD Structured Data

Add `application/ld+json` in `BaseHead`:
- Homepage: `Person` schema (name, url, sameAs for Scholar/GitHub/LinkedIn/ORCID, jobTitle, affiliation)
- Blog posts: `Article` schema (headline, author, datePublished, dateModified)
- Research page: not needed (papers have DOIs; Scholar handles their structured data)

### `robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://euzun.github.io/sitemap.xml
```

Disallow nothing — the site is fully public.

---

## 11. Accessibility Plan

### Contrast Ratios

| Token | Light | Dark | Required (AA) | Status |
|---|---|---|---|---|
| body text on bg | `gray-900` on `gray-50` | `gray-50` on `gray-950` | 4.5:1 | Pass (>15:1) |
| muted text | `gray-500` on `gray-50` | `gray-400` on `gray-950` | 4.5:1 | Pass (~7:1) |
| Indigo accent on bg | `indigo-600` on white | `indigo-400` on gray-950 | 4.5:1 (text) / 3:1 (UI) | Pass for UI; check text use |
| Teal accent on bg | `teal-600` on white | `teal-400` on gray-950 | 4.5:1 (text) | Must verify at implementation — teal-600 may need a step darker |

Concrete verification step: run `axe-core` or Lighthouse accessibility audit on every page before v1 launch.

### Focus Management

- All interactive elements have visible `:focus-visible` ring using `outline: 2px solid var(--color-accent); outline-offset: 2px`
- Default browser focus removed only when `:focus-visible` ring is present (not `:focus`)
- No `outline: none` without replacement
- `ThemeToggle`, `SearchPalette`, `BibTexModal` trap focus when open
- After modal close, focus returns to the trigger element

### Keyboard Navigation

| Action | Keyboard |
|---|---|
| Open search | `Cmd+K` / `Ctrl+K` |
| Close search/modal | `Escape` |
| Navigate TOC | `Tab` |
| Expand abstract | `Enter` / `Space` on `<details>` |
| Copy BibTeX | `Enter` on Copy button |
| Skip to content | `Tab` then `Enter` on skip link |

### Semantic HTML

- `<header role="banner">` with `<nav aria-label="Main navigation">`
- `<main id="content">` as skip-link target
- `<footer role="contentinfo">`
- `<article>` wraps each blog post
- `<aside>` wraps TOC sidebar
- `<h1>` appears exactly once per page (page title)
- Heading hierarchy: H1 → H2 → H3 (no skips)
- `<time datetime="{iso-date}">` for all dates
- `<abbr title="...">` for abbreviations (PSI, FHE, MPC, ZKP) on first use per page

### Images

- `alt=""` on decorative images
- Meaningful `alt` text on avatar and hero images
- `<figure>/<figcaption>` for captioned images in MDX

### ARIA Labels

- Theme toggle: `aria-label="Switch to dark mode"` / `"Switch to light mode"`
- Search trigger: `aria-label="Search" aria-keyshortcuts="Control+K Meta+K"`
- BibTeX modal: `aria-label="BibTeX for {paper title}"`
- Category filter buttons: `aria-pressed="true/false"` on active filter
- External links: `aria-label="{text} (opens in new tab)"`

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

ReadingProgress bar is hidden entirely under `prefers-reduced-motion`.

---

## 12. Deployment

### Repository Layout on GitHub

```
github.com/euzun/euzun.github.io
├── main branch  ← source code (Astro project)
└── gh-pages branch ← built output (managed by Actions, do not edit)
```

GitHub Pages is configured to deploy from the `gh-pages` branch (or the Actions deployment target). Source code lives on `main`.

### GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger from GitHub UI

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Astro site
        run: pnpm build
        env:
          SITE: https://euzun.github.io

      - name: Run pagefind indexing
        run: pnpm exec pagefind --site dist

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { tailwindcss } from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://euzun.github.io',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Theme names from Shiki's built-in theme list
      themes: {
        light: 'github-light',
        dark:  'github-dark',
      },
      // Wrap code blocks so long lines scroll, not overflow
      wrap: false,
    },
  },
});
```

### Build Commands

```
pnpm install        # Install deps
pnpm dev            # Dev server with HMR (localhost:4321)
pnpm build          # Production build → /dist
pnpm preview        # Preview built site locally
pnpm exec pagefind  # Run pagefind indexer after build (CI only, not in pnpm build)
```

### `package.json` Scripts

```json
{
  "scripts": {
    "dev":     "astro dev",
    "build":   "astro build",
    "preview": "astro preview",
    "check":   "astro check"
  }
}
```

pagefind is run as a separate step in CI after `astro build` so the indexer has access to the full `/dist` output.

### Custom Domain (Optional, v1.1)

To add a custom domain (e.g., `erkamuzun.com`) later:
1. Add `CNAME` file to `public/` containing `erkamuzun.com`
2. Configure DNS A records or CNAME at registrar
3. Enable HTTPS in GitHub Pages settings (auto via Let's Encrypt)
4. Update `site:` in `astro.config.mjs`

---

## 13. Open Questions for User

Prioritized — answer in order. The first two are blockers for implementation styling.

### Q1 (BLOCKER — Style): Font Pair?

**Option A — Fraunces + Inter** (scholarly editorial, serif display)
**Option B — Space Grotesk + Inter** (technical modernist, geometric sans)

The recommendation is **Option A** (Fraunces) for its academic-engineer hybrid identity, but both are excellent. Your call before any CSS is written.

---

### Q2 (BLOCKER — Style): Accent Color?

**Option A — Indigo** (`#4f46e5` / `oklch(0.60 0.22 264)`)
**Option B — Teal** (`#0d9488` / `oklch(0.55 0.14 175)`)

The recommendation is **Option B** (Teal) as it carries semantic alignment with privacy/security. But if you want to blend in with the majority of well-designed tech blogs, Indigo is the safer, universally-loved choice.

---

### Q3: Avatar on Homepage Hero?

Should the hero block include your photo (80px circle, left-aligned alongside name) or remain text-only?

- **With avatar:** More personal, recognizable, humanizes the site. Standard for personal sites.
- **Text-only:** Cleaner, more editorial, keeps focus on the words. Some respected researchers prefer this.

---

### Q4: Pagefind Search in v1 or v1.1?

Pagefind adds a `pagefind --site dist` step post-build and includes ~40KB of client JS for the search UI. It's straightforward but adds some CI complexity.

- **Include in v1:** Full search from day one. Recommended if you expect to publish frequently and want discoverability.
- **Push to v1.1:** Ship the core site faster, add search in the second sprint.

---

### Q5: Publications — Single JSON File or One-File-Per-Paper?

Two options for storing publication data:

- **Single `publications.json`** (recommended): One array, all papers. Easy to edit, sort, and filter. Works perfectly with Astro's Content Layer JSON loader.
- **One `.yaml` or `.json` per paper** in `src/content/publications/`: More git-friendly diffs per paper, but more files to manage. Worth it only if you expect many collaborators editing this data.

For a personal site maintained by one person, a single file is simpler.

---

### Q6: Should `/talks`, `/now`, `/uses` pages be live stubs in v1?

These are listed as "Optional v1.1" in the IA. Options:

- **Include empty stubs** (minimal content, "coming soon" or just a heading): Makes the nav complete from day one, establishes the URLs permanently.
- **Exclude entirely from v1:** Cleaner first launch, no empty pages. Add when there's content to fill them.

Recommendation: Exclude `/now` and `/uses` (no-one expects them on day one), but include a `/talks` stub since it's academically important and you likely have talks to list.

---

*End of DESIGN.md*
*Author: Claude Code (Architect) — for review by Erkam Uzun*
*Implementation may begin after Q1 and Q2 are answered.*
