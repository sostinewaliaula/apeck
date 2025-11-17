import { getApiBaseUrl } from './config';

const API_BASE_URL = getApiBaseUrl();

type NewsResponse = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  body?: string;
  hero_image_url?: string | null;
  reading_time?: string | null;
  published_at?: string | null;
  show_on_home?: number | boolean;
  home_display_order?: number | null;
};

export type PublicNewsSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  heroImageUrl?: string;
  readingTime?: string;
  publishedAt?: string;
  showOnHome: boolean;
  homeDisplayOrder: number;
};

export type PublicNewsArticle = PublicNewsSummary & {
  body: string;
};

function normalizeNews(row: NewsResponse): PublicNewsSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    heroImageUrl: row.hero_image_url ?? undefined,
    readingTime: row.reading_time ?? undefined,
    publishedAt: row.published_at ?? undefined,
    showOnHome: Boolean(row.show_on_home),
    homeDisplayOrder: row.home_display_order ?? 0,
  };
}

export async function fetchNewsList(options?: {
  featured?: boolean;
  limit?: number;
}) {
  const url = new URL(`${API_BASE_URL}/news`);
  if (options?.featured) {
    url.searchParams.set('featured', 'true');
  }
  if (options?.limit !== undefined) {
    url.searchParams.set('limit', String(options.limit));
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to load news');
  }

  const data = (await response.json()) as NewsResponse[];
  return data.map(normalizeNews);
}

export async function fetchNewsArticle(slug: string) {
  const response = await fetch(`${API_BASE_URL}/news/${slug}`);
  if (!response.ok) {
    throw new Error('News article not found');
  }
  const data = (await response.json()) as NewsResponse & { body: string };
  return {
    ...normalizeNews(data),
    body: data.body,
  } as PublicNewsArticle;
}


