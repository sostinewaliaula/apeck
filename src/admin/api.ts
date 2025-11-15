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

