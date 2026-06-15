export function formatDate(date: Date): string {
  // Frontmatter dates (e.g. "2026-06-02") parse to UTC midnight, so format in
  // UTC too — otherwise a negative-offset runtime renders the previous day.
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getYearRange(start: number, end?: number): string {
  if (end) {
    return `${start}–${end}`;
  }
  return `${start}–present`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
