const API_BASE_URL = import.meta.env.VITE_CMS_API_URL ?? 'http://localhost:4000/api';

export type EventsResponse = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  category?: string | null;
  status: 'draft' | 'published';
  cover_media_url?: string | null;
};

export type PublicEventSummary = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category?: string;
  coverImageUrl?: string;
};

function normalizeEvent(row: EventsResponse): PublicEventSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    location: row.location ?? undefined,
    category: row.category ?? undefined,
    coverImageUrl: row.cover_media_url ?? undefined,
  };
}

export async function fetchEventsList(options?: { limit?: number }) {
  const url = new URL(`${API_BASE_URL}/events`);
  if (options?.limit !== undefined) {
    url.searchParams.set('limit', String(options.limit));
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to load events');
  }
  const data = (await response.json()) as EventsResponse[];
  return data.map(normalizeEvent);
}