const API_BASE_URL = import.meta.env.VITE_CMS_API_URL ?? 'http://localhost:4000/api';

type FetchOptions = RequestInit & { accessToken?: string | null };

async function request<T>(path: string, { accessToken, headers, ...options }: FetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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

  return response.json() as Promise<T>;
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

export type RouteSummary = {
  slug: string;
  target: string;
};

export function fetchRoutes(accessToken: string | null) {
  return request<RouteSummary[]>('/pages', {
    method: 'GET',
    accessToken,
  });
}

