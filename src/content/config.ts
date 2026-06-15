import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CategoryEnum = z.enum([
  'research',
  'engineering',
  'agents',
  'crypto',
  'opinion',
  'talk',
  'award',
  'life',
]);

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: CategoryEnum,
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    readTime: z.number().int().positive().optional(),
    math: z.boolean().default(false),
    featured: z.boolean().default(false),
    relatedProject: z.string().optional(),
    repoUrl: z.string().url().optional(),
  }),
});

const VenueTypeEnum = z.enum([
  'conference',
  'journal',
  'workshop',
  'magazine',
  'preprint',
]);

const publicationsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(
      z.object({
        name: z.string(),
        isErkam: z.boolean().default(false),
        url: z.string().url().optional(),
      }),
    ),
    venue: z.string(),
    venueType: VenueTypeEnum,
    year: z.number().int().min(2000).max(2030),
    bibtex: z.string(),
    abstract: z.string().optional(),
    url: z.string().url().optional(),
    pdfUrl: z.string().url().optional(),
    codeUrl: z.string().url().optional(),
    slidesUrl: z.string().url().optional(),
    doi: z.string().optional(),
    selected: z.boolean().default(false),
    projectSlug: z.string().optional(),
    citationCount: z.number().int().nonnegative().optional(),
    awardNote: z.string().optional(),
  }),
});

const patentsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    number: z.string(),
    title: z.string(),
    assignee: z.string(),
    year: z.number().int().min(2010).max(2030),
    url: z.string().url(),
    projectSlug: z.string().optional(),
    inventors: z.array(z.string()).optional(),
    abstract: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    shortDescription: z.string(),
    role: z.string(),
    org: z.string(),
    tech: z.array(z.string()),
    yearStart: z.number().int().min(2000).max(2030),
    yearEnd: z.number().int().min(2000).max(2030).optional(),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    icon: z.string().optional(),
    placeholder: z.boolean().default(false),
    industry: z.boolean().default(false),
    featured: z.boolean().default(false),
    links: z
      .object({
        paper: z.string().url().optional(),
        code: z.string().url().optional(),
        demo: z.string().url().optional(),
        post: z.string().optional(),
      })
      .default({}),
    videos: z
      .array(z.object({ label: z.string(), url: z.string().url(), caption: z.string().optional(), diagram: z.string().optional(), diagramCaption: z.string().optional() }))
      .optional(),
    resources: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .optional(),
    relatedPublications: z.array(z.string()).optional(),
  }),
});

const talksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    eventUrl: z.string().url().optional(),
    date: z.coerce.date(),
    location: z.string().optional(),
    slidesUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    abstract: z.string().optional(),
    relatedPublication: z.string().optional(),
  }),
});

// Guides live in a separate repo (euzun/guides), mounted here as the `guides`
// git submodule. Content is portable Markdown; pages are organized as
// <guide>/<NN-section>/<NN-page>.md, with order derived from the numbering.
const guidesCollection = defineCollection({
  loader: glob({ pattern: '*/**/*.md', base: './guides' }),
  schema: z.object({
    title: z.string(),
    lede: z.string(),
    description: z.string().optional(),
  }),
});

const guideMetaCollection = defineCollection({
  loader: glob({ pattern: '*/guide.json', base: './guides' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    level: z.string().default('intro'),
    order: z.number().int().default(1),
    sectionTitles: z.record(z.string()).default({}),
    note: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  publications: publicationsCollection,
  patents: patentsCollection,
  projects: projectsCollection,
  talks: talksCollection,
  guides: guidesCollection,
  guideMeta: guideMetaCollection,
};
