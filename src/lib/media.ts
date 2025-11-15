const CMS_API_URL = import.meta.env.VITE_CMS_API_URL ?? 'http://localhost:4000/api';

function getCmsOrigin() {
  return CMS_API_URL.replace(/\/api$/, '');
}

export function resolveMediaUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const origin = getCmsOrigin();
  if (url.startsWith('/')) {
    return `${origin}${url}`;
  }
  return `${origin}/${url}`;
}

