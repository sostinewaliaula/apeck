export function getApiBaseUrl(): string {
  // Runtime overrides (no rebuild required)
  const win = window as unknown as { __APECK_API_URL__?: string };
  const fromWindow = typeof win.__APECK_API_URL__ === 'string' ? win.__APECK_API_URL__ : undefined;
  const fromMeta =
    (document.querySelector('meta[name="apeck-api-url"]') as HTMLMetaElement | null)?.content?.trim() || undefined;
  const fromStorage = localStorage.getItem('apeck_api_url') || undefined;

  // Build-time env (Vite)
  const fromEnv = import.meta.env.VITE_CMS_API_URL as string | undefined;

  const base = fromWindow || fromMeta || fromStorage || fromEnv || 'http://localhost:4000/api';
  const final = base.replace(/\/+$/, '');
  
  // Debug logging (remove in production)
  if (import.meta.env.DEV) {
    console.log('[APECK API Config]', {
      fromWindow,
      fromMeta,
      fromStorage,
      fromEnv,
      final,
    });
  }
  
  return final;
}


