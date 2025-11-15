import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Eye, EyeOff, Loader2, Newspaper, Plus, Star } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import {
  AdminNews,
  createNews,
  deleteNews,
  fetchAdminNews,
  NewsPayload,
  publishNews,
  updateNews,
} from '../api';

const initialForm: NewsPayload = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  status: 'draft',
  showOnHome: false,
  homeDisplayOrder: 0,
};

const statusFilters = ['all', 'draft', 'scheduled', 'published'] as const;

export function AdminNewsList() {
  const { accessToken } = useAuth();
  const [newsItems, setNewsItems] = useState<AdminNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadNews = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminNews(accessToken, {
        status: statusFilter === 'all' ? undefined : statusFilter,
        showOnHome: showFeaturedOnly ? true : undefined,
        search: search || undefined,
      });
      setNewsItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, statusFilter, showFeaturedOnly]);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    await loadNews();
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await createNews(accessToken, createForm);
      setCreateForm(initialForm);
      setNewsItems((prev) => [created, ...prev]);
      navigate(`/admin/news/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (item: AdminNews) => {
    if (!accessToken) return;
    try {
      const updated = await updateNews(accessToken, item.id, {
        showOnHome: !item.showOnHome,
      });
      setNewsItems((prev) => prev.map((news) => (news.id === item.id ? { ...news, showOnHome: updated.showOnHome } : news)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    }
  };

  const handlePublish = async (item: AdminNews) => {
    if (!accessToken) return;
    try {
      const updated = await publishNews(accessToken, item.id);
      setNewsItems((prev) =>
        prev.map((news) => (news.id === item.id ? { ...news, status: updated.status, publishedAt: updated.publishedAt } : news)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish article');
    }
  };

  const handleDelete = async (item: AdminNews) => {
    if (!accessToken) return;
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;
    try {
      await deleteNews(accessToken, item.id);
      setNewsItems((prev) => prev.filter((news) => news.id !== item.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  return (
    <AdminLayout
      title="News & Updates"
      description="Manage long-form news articles and feature highlights on the homepage."
    >
      <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
        <div className="rounded-2xl border border-[#F0E7DA] bg-white/95 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#B15C5C]">All articles</p>
              <p className="text-xs text-[#6B4E3D]/80">Edit, publish, or feature news on the homepage.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <form onSubmit={handleSearch}>
                <input
                  className="rounded-full border border-[#E7DED1] px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#8B2332]"
                  placeholder="Search title or excerpt"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <div className="flex items-center gap-1 rounded-full border border-[#E7DED1] px-2 py-1">
                {statusFilters.map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={`px-2 py-0.5 rounded-full ${
                      statusFilter === status ? 'bg-[#8B2332] text-white' : 'text-[#6B4E3D]'
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${
                  showFeaturedOnly ? 'border-[#8B2332] text-[#8B2332]' : 'border-[#E7DED1] text-[#6B4E3D]'
                }`}
                onClick={() => setShowFeaturedOnly((prev) => !prev)}
              >
                <Star size={12} />
                Homepage only
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[#2F1E1A]">
              <thead className="bg-[#FDF5EA] text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Homepage</th>
                  <th className="px-4 py-3 text-right">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B4E3D]">
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} /> Loading articles…
                      </div>
                    </td>
                  </tr>
                ) : newsItems.length ? (
                  newsItems.map((item) => (
                    <tr key={item.id} className="border-t border-[#F5EDE2] hover:bg-[#FFF9F2]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#2F1E1A]">{item.title}</div>
                        <div className="text-xs text-[#6B4E3D]/70">/{item.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === 'published'
                              ? 'bg-[#E6F6EF] text-[#1E7A55]'
                              : item.status === 'scheduled'
                                ? 'bg-[#FFF0DB] text-[#8A4B0A]'
                                : 'bg-[#FDE7ED] text-[#8B2332]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                            item.showOnHome
                              ? 'border-[#1E7A55] text-[#1E7A55]'
                              : 'border-[#E7DED1] text-[#6B4E3D]'
                          }`}
                          onClick={() => handleToggleFeatured(item)}
                        >
                          {item.showOnHome ? (
                            <>
                              <Eye size={12} /> Featured
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} /> Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B4E3D]/70">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full border border-[#E7DED1] px-3 py-1 text-[#6B4E3D]"
                            onClick={() => navigate(`/admin/news/${item.id}`)}
                          >
                            <Newspaper size={12} />
                            Edit
                          </button>
                          {item.status !== 'published' && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-[#8B2332]/30 px-3 py-1 text-[#8B2332]"
                              onClick={() => handlePublish(item)}
                            >
                              <ArrowUpRight size={12} />
                              Publish
                            </button>
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-red-600"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B4E3D]">
                      No articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E7DA] bg-gradient-to-br from-[#FFF8EE] to-white p-5">
          <div className="flex items-center gap-2 text-[#8B2332]">
            <Plus size={16} />
            <div>
              <p className="text-sm font-semibold">Create a news article</p>
              <p className="text-xs text-[#6B4E3D]/80">Draft copy here, then fine-tune body & media.</p>
            </div>
          </div>
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
                placeholder="annual-leadership-conference"
                value={createForm.slug}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
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
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Body</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                rows={4}
                value={createForm.body}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, body: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6B4E3D]">
                <input
                  type="checkbox"
                  checked={createForm.showOnHome}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, showOnHome: e.target.checked }))}
                  className="rounded border-[#E7DED1] text-[#8B2332] focus:ring-[#8B2332]"
                />
                Feature on homepage immediately
              </label>
              {createForm.showOnHome && (
                <input
                  type="number"
                  className="w-20 rounded-lg border border-[#E7DED1] px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                  value={createForm.homeDisplayOrder}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, homeDisplayOrder: Number(e.target.value) }))}
                  min={0}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !createForm.title || !createForm.body}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B2332] py-2 text-sm font-semibold text-white hover:bg-[#761c29] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Creating…
                </>
              ) : (
                <>
                  <Newspaper size={16} />
                  Create article
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}


