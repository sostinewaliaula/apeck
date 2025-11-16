import { getApiBaseUrl } from './config';
const API_BASE_URL = getApiBaseUrl();

export type PublishedSection = {
  id: string;
  key: string;
  content: Record<string, unknown>;
};

export type PageContent = {
  slug: string;
  title: string;
  sections: PublishedSection[];
};

export async function fetchPageContent(slug: string): Promise<PageContent> {
  const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page "${slug}"`);
  }
  return response.json();
}

