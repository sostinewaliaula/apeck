const API_BASE_URL = import.meta.env.VITE_CMS_API_URL ?? 'http://localhost:4000/api';

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

