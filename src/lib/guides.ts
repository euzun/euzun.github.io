import { getCollection, type CollectionEntry } from 'astro:content';

export interface PageInfo {
  id: string;
  entry: CollectionEntry<'guides'>;
  guide: string;
  sectionDir: string;
  sectionNum: number;
  pageNum: number;
  slug: string; // path within the guide, e.g. "01-foundations/01-sign-verify"
  numLabel: string; // e.g. "1.1"
  href: string;
  title: string;
}

export interface TocSection {
  num: number;
  key: string;
  title: string;
  pages: PageInfo[];
}

function leadingNum(s: string): number {
  const m = s.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

export function parsePage(entry: CollectionEntry<'guides'>): PageInfo {
  const parts = entry.id.split('/');
  const guide = parts[0];
  const sectionDir = parts[1] ?? '';
  const pageFile = parts[2] ?? '';
  const slug = parts.slice(1).join('/');
  const sectionNum = leadingNum(sectionDir);
  const pageNum = leadingNum(pageFile);
  return {
    id: entry.id,
    entry,
    guide,
    sectionDir,
    sectionNum,
    pageNum,
    slug,
    numLabel: `${sectionNum}.${pageNum}`,
    href: `/guides/${guide}/${slug}`,
    title: entry.data.title,
  };
}

export async function getGuidePages(guide: string): Promise<PageInfo[]> {
  const all = await getCollection('guides');
  return all
    .map(parsePage)
    .filter((p) => p.guide === guide)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function buildToc(
  pages: PageInfo[],
  sectionTitles: Record<string, string>,
): TocSection[] {
  const sections: TocSection[] = [];
  for (const p of pages) {
    let sec = sections.find((s) => s.key === p.sectionDir);
    if (!sec) {
      sec = {
        num: p.sectionNum,
        key: p.sectionDir,
        title: sectionTitles[p.sectionDir] ?? p.sectionDir,
        pages: [],
      };
      sections.push(sec);
    }
    sec.pages.push(p);
  }
  return sections;
}
