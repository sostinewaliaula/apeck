export const ACCESS_TOKEN_KEY = 'apeck_admin_access';
export const REFRESH_TOKEN_KEY = 'apeck_admin_refresh';
export const AUTH_USER_KEY = 'apeck_admin_user';

export function getStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStored(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function clearStored() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

