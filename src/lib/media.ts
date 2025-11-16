import { getApiBaseUrl } from './config';
const CMS_API_URL = getApiBaseUrl();

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

