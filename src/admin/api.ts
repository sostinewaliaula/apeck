const API_BASE_URL = import.meta.env.VITE_CMS_API_URL ?? 'http://localhost:4000/api';

type FetchOptions = RequestInit & { accessToken?: string | null; query?: Record<string, string | undefined> };

function buildUrl(path: string, query?: Record<string, string | undefined>) {
  if (!query) return `${API_BASE_URL}${path}`;
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
    .join('&');
  return params ? `${API_BASE_URL}${path}?${params}` : `${API_BASE_URL}${path}`;
}

async function request<T>(path: string, { accessToken, headers, query, ...options }: FetchOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

export function loginRequest(email: string, password: string) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export type AdminRoute = {
  id: string;
  slug: string;
  target: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type RouteResponse = {
  id: string;
  slug: string;
  target: string;
  is_active: number | boolean;
  created_at?: string;
  updated_at?: string;
};

const normalizeRoute = (route: RouteResponse): AdminRoute => ({
  id: route.id,
  slug: route.slug,
  target: route.target,
  isActive: Boolean(route.is_active),
  createdAt: route.created_at,
  updatedAt: route.updated_at,
});

export function fetchRoutes(accessToken: string | null) {
  if (!accessToken) {
    return Promise.resolve([]);
  }
  return request<RouteResponse[]>('/admin/routes', {
    method: 'GET',
    accessToken,
  }).then((routes) => routes.map(normalizeRoute));
}

export type RoutePayload = {
  slug: string;
  target: string;
  isActive: boolean;
};

export function createRoute(accessToken: string, payload: RoutePayload) {
  return request<RouteResponse>('/admin/routes', {
    method: 'POST',
    accessToken,
    body: JSON.stringify({
      slug: payload.slug,
      target: payload.target,
      isActive: payload.isActive,
    }),
  }).then(normalizeRoute);
}

export function updateRoute(accessToken: string, id: string, payload: Partial<RoutePayload>) {
  return request<RouteResponse>(`/admin/routes/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify({
      slug: payload.slug,
      target: payload.target,
      isActive: payload.isActive,
    }),
  }).then(normalizeRoute);
}

export function deleteRoute(accessToken: string, id: string) {
  return request<void>(`/admin/routes/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

export type PageSummary = {
  id: string;
  slug: string;
  title: string;
  status: string;
  updatedAt?: string;
};

type PageResponse = {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at?: string;
};

const normalizePage = (page: PageResponse): PageSummary => ({
  id: page.id,
  slug: page.slug,
  title: page.title,
  status: page.status,
  updatedAt: page.updated_at,
});

export type PageSection = {
  id: string;
  key: string;
  displayOrder: number;
  status: string;
  content: Record<string, unknown>;
};

export type PageDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: string;
  sections: PageSection[];
};

export function fetchPages(accessToken: string | null, slug?: string) {
  if (!accessToken) return Promise.resolve([]);
  return request<PageResponse[]>('/admin/pages', {
    method: 'GET',
    accessToken,
    query: { slug },
  }).then((pages) => pages.map(normalizePage));
}

type PageDetailResponse = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
  status: string;
  sections: Array<{
    id: string;
    key: string;
    display_order: number;
    status: string;
    content: Record<string, unknown>;
  }>;
};

const normalizePageDetail = (page: PageDetailResponse): PageDetail => ({
  id: page.id,
  slug: page.slug,
  title: page.title,
  excerpt: page.excerpt ?? undefined,
  seoTitle: page.seo_title ?? undefined,
  seoDescription: page.seo_description ?? undefined,
  status: page.status,
  sections: page.sections.map((section) => ({
    id: section.id,
    key: section.key,
    displayOrder: section.display_order,
    status: section.status,
    content: section.content ?? {},
  })),
});

export function fetchPageDetail(accessToken: string, pageId: string) {
  return request<PageDetailResponse>(`/admin/pages/${pageId}`, {
    method: 'GET',
    accessToken,
  }).then(normalizePageDetail);
}

export type PagePayload = {
  title: string;
  slug: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export function createPage(accessToken: string, payload: PagePayload) {
  return request<PageResponse>('/admin/pages', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizePage);
}

export function updatePage(accessToken: string, pageId: string, payload: Partial<PagePayload & { status: string }>) {
  return request<PageResponse>(`/admin/pages/${pageId}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizePage);
}

export function publishPage(accessToken: string, pageId: string) {
  return request<PageResponse>(`/admin/pages/${pageId}/publish`, {
    method: 'POST',
    accessToken,
  }).then(normalizePage);
}

export type SectionPayload = {
  key: string;
  displayOrder: number;
  status: string;
  content: Record<string, unknown>;
};

type SectionResponse = {
  id: string;
  key: string;
  display_order: number;
  status: string;
  content: Record<string, unknown>;
};

const normalizeSection = (section: SectionResponse): PageSection => ({
  id: section.id,
  key: section.key,
  displayOrder: section.display_order,
  status: section.status,
  content: section.content ?? {},
});

export function createPageSection(accessToken: string, pageId: string, payload: SectionPayload) {
  return request<SectionResponse>(`/admin/pages/${pageId}/sections`, {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizeSection);
}

export function updatePageSection(accessToken: string, sectionId: string, payload: Partial<SectionPayload>) {
  return request<SectionResponse>(`/admin/pages/sections/${sectionId}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizeSection);
}

export function deletePageSection(accessToken: string, sectionId: string) {
  return request<void>(`/admin/pages/sections/${sectionId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export type MediaAsset = {
  id: string;
  file_name: string;
  url: string;
  alt_text?: string;
  mime_type?: string;
  created_at?: string;
};

export function fetchMediaAssets(accessToken: string) {
  return request<MediaAsset[]>('/admin/media', {
    method: 'GET',
    accessToken,
  });
}

export function uploadMediaAsset(accessToken: string, file: File, altText?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (altText) formData.append('altText', altText);
  return fetch(`${API_BASE_URL}/admin/media`, {
    method: 'POST',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.text()) || 'Failed to upload media');
    }
    return res.json() as Promise<MediaAsset>;
  });
}

export function deleteMediaAsset(accessToken: string, id: string) {
  return request<void>(`/admin/media/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

export type AdminNews = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  status: string;
  showOnHome: boolean;
  homeDisplayOrder: number;
  heroImageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
};

type NewsResponse = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  status: string;
  show_on_home: number | boolean;
  home_display_order?: number | null;
  hero_image_url?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  reading_time?: string | null;
};

const normalizeNews = (news: NewsResponse): AdminNews => ({
  id: news.id,
  slug: news.slug,
  title: news.title,
  excerpt: news.excerpt ?? undefined,
  status: news.status,
  showOnHome: Boolean(news.show_on_home),
  homeDisplayOrder: news.home_display_order ?? 0,
  heroImageUrl: news.hero_image_url ?? undefined,
  publishedAt: news.published_at ?? undefined,
  updatedAt: news.updated_at ?? undefined,
  readingTime: news.reading_time ?? undefined,
});

type NewsDetailResponse = NewsResponse & {
  body: string;
};

export type NewsDetail = AdminNews & {
  body: string;
};

const normalizeNewsDetail = (news: NewsDetailResponse): NewsDetail => ({
  ...normalizeNews(news),
  body: news.body,
});

export type NewsPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  body: string;
  status?: 'draft' | 'scheduled' | 'published';
  heroImageUrl?: string;
  heroMediaId?: string;
  showOnHome?: boolean;
  homeDisplayOrder?: number;
  readingTime?: string;
  publishedAt?: string;
};

export function fetchAdminNews(
  accessToken: string,
  filters?: { status?: string; showOnHome?: boolean; search?: string },
) {
  return request<NewsResponse[]>('/admin/news', {
    method: 'GET',
    accessToken,
    query: {
      status: filters?.status,
      showOnHome: filters?.showOnHome !== undefined ? String(filters.showOnHome) : undefined,
      search: filters?.search,
    },
  }).then((rows) => rows.map(normalizeNews));
}

export function fetchNewsDetail(accessToken: string, id: string) {
  return request<NewsDetailResponse>(`/admin/news/${id}`, {
    method: 'GET',
    accessToken,
  }).then(normalizeNewsDetail);
}

export function createNews(accessToken: string, payload: NewsPayload) {
  return request<NewsResponse>('/admin/news', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizeNews);
}

export function updateNews(accessToken: string, id: string, payload: Partial<NewsPayload>) {
  return request<NewsResponse>(`/admin/news/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizeNewsDetail);
}

export function publishNews(accessToken: string, id: string) {
  return request<NewsResponse>(`/admin/news/${id}/publish`, {
    method: 'POST',
    accessToken,
  }).then(normalizeNewsDetail);
}

export function deleteNews(accessToken: string, id: string) {
  return request<void>(`/admin/news/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

// ------- Events Admin API -------
export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  startDate: string;
  endDate?: string;
  location?: string;
  category?: string;
  coverImageUrl?: string;
  updatedAt?: string;
};

type EventResponse = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: 'draft' | 'published';
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
  updated_at?: string | null;
};

const normalizeEvent = (e: EventResponse): AdminEvent => ({
  id: e.id,
  slug: e.slug,
  title: e.title,
  description: e.description ?? undefined,
  status: e.status,
  startDate: e.start_date,
  endDate: e.end_date ?? undefined,
  location: e.location ?? undefined,
  category: e.category ?? undefined,
  coverImageUrl: e.cover_image_url ?? undefined,
  updatedAt: e.updated_at ?? undefined,
});

export type EventPayload = {
  title: string;
  slug?: string;
  description?: string;
  status?: 'draft' | 'published';
  startDate: string;
  endDate?: string;
  location?: string;
  category?: string;
  coverImageUrl?: string;
};

export function fetchAdminEvents(accessToken: string) {
  return request<EventResponse[]>('/admin/events', {
    method: 'GET',
    accessToken,
  }).then((rows) => rows.map(normalizeEvent));
}

export function createEvent(accessToken: string, payload: EventPayload) {
  return request<EventResponse>('/admin/events', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizeEvent);
}

export function updateEvent(accessToken: string, id: string, payload: Partial<EventPayload>) {
  return request<EventResponse>(`/admin/events/${id}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(payload),
  }).then(normalizeEvent);
}

export function publishEvent(accessToken: string, id: string) {
  return request<EventResponse>(`/admin/events/${id}/publish`, {
    method: 'POST',
    accessToken,
  }).then(normalizeEvent);
}

export function deleteEvent(accessToken: string, id: string) {
  return request<void>(`/admin/events/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

// Email Recipients API
export type EmailRecipientResponse = {
  id: string;
  email: string;
  name?: string;
  type: 'membership' | 'general';
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

const normalizeEmailRecipient = (r: any): EmailRecipientResponse => ({
  id: r.id,
  email: r.email,
  name: r.name ?? undefined,
  type: r.type,
  isActive: r.is_active ?? r.isActive ?? true,
  displayOrder: r.display_order ?? r.displayOrder ?? 0,
  createdAt: r.created_at ?? r.createdAt,
  updatedAt: r.updated_at ?? r.updatedAt,
});

export type EmailRecipientPayload = {
  email: string;
  name?: string;
  type: 'membership' | 'general';
  isActive?: boolean;
  displayOrder?: number;
};

export function fetchEmailRecipients(accessToken: string) {
  return request<{ success: boolean; recipients: any[] }>('/email-recipients', {
    method: 'GET',
    accessToken,
  }).then((response) => response.recipients.map((r: any) => normalizeEmailRecipient(r)));
}

export function createEmailRecipient(accessToken: string, payload: EmailRecipientPayload) {
  return request<{ success: boolean; recipient: any }>('/email-recipients', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  }).then((response) => normalizeEmailRecipient(response.recipient));
}

export function updateEmailRecipient(accessToken: string, id: string, payload: Partial<EmailRecipientPayload>) {
  return request<{ success: boolean; recipient: any }>(`/email-recipients/${id}`, {
    method: 'PUT',
    accessToken,
    body: JSON.stringify(payload),
  }).then((response) => normalizeEmailRecipient(response.recipient));
}

export function deleteEmailRecipient(accessToken: string, id: string) {
  return request<void>(`/email-recipients/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

