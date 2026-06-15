# Guides platform plan

Turn the one-off "Teaching" section into a scalable, multi-guide library that is
rendered on the personal site but whose content lives in a separate, star-able
repo.

## Vision

A growing personal knowledge library of short, beginner-friendly guides across
topics Erkam knows (applied crypto / hardware root of trust / attestation today;
OAuth & token flows, 2PC, FHE later). Goals: easy publishing, self-advertisement
on-brand, closing knowledge gaps by teaching, a reference for beginners / job
seekers / tutors, a base for future lecturing, and a feedback + social-proof
surface. Possible future interactivity (quizzes, runnable code) is **out of scope
for now** — that will likely just link out to a code repo.

## Locked decisions

1. **Content repo:** `euzun/guides` (topic-neutral monorepo for all guides).
2. **Nav label / URL:** "Guides" → `/guides`.
3. **Wiring:** git **submodule** at `./guides`, read via Astro Content Layer
   `glob({ base: './guides' })`. Reliable with GitHub Pages
   (`submodules: recursive`), pins exact content version per build.
4. **Author format:** **Markdown + fenced `mermaid`**, with callout/takeaway/diagram
   wrappers kept as raw HTML (styled on the site via CSS, degrade to plain-but-
   readable text on GitHub). Custom components only as future enhancement.
5. **No GitHub Pages on `euzun/guides`** — it is source-only. One canonical
   rendered site (`euzun.github.io`), one browsable source repo. (Mirrors the
   `agentic-sdlc` repo model.)
6. **First chunk = Phases 0–3.** Social/feedback layer (Phase 4) when guide #2
   nears; interactivity (Phase 5) much later.

## Architecture

```
euzun/guides   (NEW, public)          euzun.github.io  (existing)
─────────────────────────             ──────────────────────────
content + images only                 rendering, layout, routing
  applied-crypto/                      consumes guides/ as a
    guide.json                         git submodule at ./guides
    01-foundations/
      01-sign-verify.md        ──►     src/content.config.ts
      ...                              (glob loader → ./guides)
  oauth-token-flows/   (future)        src/pages/guides/*
  fhe/                 (future)        src/layouts/GuideLayout.astro
  README.md (TOC + star pitch)         renders on euzun.github.io
```

Separation of concerns: `guides` repo = Markdown + images only. All presentation
(layout, callout/takeaway styling, Mermaid wiring, diagram-zoom) stays in the
website repo. Stars / issues / "suggest an edit" point at the `guides` repo.

Because `/teaching` was never merged to `main` (only on `feature/teaching-section`,
and the site deploys from `main`), there are **no live URLs to preserve** — we can
rename to `/guides` with zero redirect debt.

### `euzun/guides` layout

```
applied-crypto/
  guide.json     # { title, slug, description, level, order, sectionTitles{} }
  01-foundations/
    01-sign-verify.md
    ...
  assets/        # images for this guide
README.md
```

Section + order + prev/next are derived from folder/file numbering — no
hand-maintained prev/next (unlike the current `.astro` pages).

### Website changes

1. `guides` collection in `src/content.config.ts` via
   `glob({ pattern: '**/*.md', base: './guides' })` + path → guide/section/order helper.
2. Generalize `TeachingLayout.astro` → `GuideLayout.astro`: add persistent
   left-rail section TOC; keep Mermaid + diagram-zoom + callouts; auto-compute
   prev/next from collection order.
3. Routes under `src/pages/guides/`: `index.astro` (hub), `[guide]/index.astro`
   (cover), `[guide]/[...slug].astro` (page).
4. Nav: replace "Teaching" with "Guides" in `Header.astro`.
5. Add a build step (rehype) to turn fenced ` ```mermaid ` into the site's
   `<pre class="mermaid">` so content renders on both GitHub and the site.
6. CI: add `submodules: recursive` to `.github/workflows/deploy.yml`.
7. Delete old `src/pages/teaching/**` and reference `crypto-teaching/` after verify.

## Phases

| Phase | Outcome |
|---|---|
| 0. Migration script | `.astro` × 34 → `.md` (frontmatter, body to Markdown, fenced mermaid, drop hardcoded prev/next). Output to a staging dir to eyeball. |
| 1. Stand up `euzun/guides` | new public repo seeded with `applied-crypto/` + `guide.json` + README. (Confirm before creating external repo.) |
| 2. Wire website | submodule + `guides` collection + `GuideLayout` + 3 routes + nav + mermaid rehype. |
| 3. Hub polish | hub landing, guide covers, level tags, left-rail TOC. |
| 4. Social/feedback | README, "Star on GitHub" + "Suggest an edit" links, giscus comments, lightweight analytics. |
| 5. (much later) | interactivity — likely link out to a code repo, format TBD. |
