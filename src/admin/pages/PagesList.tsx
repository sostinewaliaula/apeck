import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import { createPage, fetchPages, PagePayload, PageSummary } from '../api';

const initialPageForm: PagePayload = {
  title: '',
  slug: '',
  excerpt: '',
  seoTitle: '',
  seoDescription: '',
};

export function AdminPagesList() {
  const { accessToken } = useAuth();
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(initialPageForm);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchPages(accessToken);
        setPages(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pages');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken]);

  const recentPages = useMemo(
    () => pages.slice().sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')),
    [pages],
  );

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsCreating(true);
    setError(null);
    try {
      const page = await createPage(accessToken, createForm);
      setPages((prev) => [page, ...prev]);
      setCreateForm(initialPageForm);
      if (page.id) {
        navigate(`/admin/pages/${page.id}`);
      } else {
        setError('Page was created, but no id was returned from the server.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AdminLayout
      title="Pages & Layouts"
      description="Every public page lives here. Pick one to edit sections, copy, and SEO before publishing."
    >
      <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
        <div className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#B15C5C]">All pages</p>
              <p className="text-xs text-[#6B4E3D]/80">Click a row to edit metadata and sections.</p>
            </div>
            <span className="text-xs text-[#6B4E3D]/70">{pages.length} total</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left text-[#2F1E1A]">
              <thead className="bg-[#FDF5EA] text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr key="loading">
                    <td colSpan={4} className="px-4 py-6 text-center text-[#6B4E3D]">
                      Loading pages…
                    </td>
                  </tr>
                ) : recentPages.length ? (
                  recentPages.map((page) => (
                    <tr
                      key={page.id}
                      className="border-t border-[#F5EDE2] hover:bg-[#FFF9F2] cursor-pointer"
                      onClick={() => navigate(`/admin/pages/${page.id}`)}
                    >
                      <td className="px-4 py-3 font-semibold">{page.title}</td>
                      <td className="px-4 py-3 text-[#6B4E3D]/80">/{page.slug}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            page.status === 'published'
                              ? 'bg-[#E6F6EF] text-[#1E7A55]'
                              : 'bg-[#FFF0DB] text-[#8A4B0A]'
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B4E3D]/70">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="empty">
                    <td colSpan={4} className="px-4 py-6 text-center text-[#6B4E3D]">
                      No pages created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>

        <div className="rounded-2xl border border-[#F0E7DA] bg-gradient-to-br from-[#FFF8EE] to-white p-5">
          <p className="text-sm uppercase tracking-wide text-[#B15C5C]">Create a page</p>
          <p className="text-xs text-[#6B4E3D]/80">Start with Home (slug: home) to wire editing.</p>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Title</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                value={createForm.title}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Slug</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                placeholder="home"
                value={createForm.slug}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Excerpt</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                rows={2}
                value={createForm.excerpt}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !createForm.title || !createForm.slug}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B2332] py-2 text-sm font-semibold text-white hover:bg-[#761c29] disabled:opacity-60"
            >
              <Plus size={16} />
              {isCreating ? 'Creating…' : 'Create page'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

