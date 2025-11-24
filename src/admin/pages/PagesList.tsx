import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, RotateCcw, Clock } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import {
  createPage,
  deletePage,
  fetchPages,
  fetchPageSettings,
  forceDeletePage,
  PagePayload,
  PageSummary,
  restorePage,
  updatePageSettings,
} from '../api';

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
  const [notice, setNotice] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(initialPageForm);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [forceDeletingId, setForceDeletingId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const [isSavingRetention, setIsSavingRetention] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      setIsLoading(true);
      setError(null);
      setNotice(null);
      try {
        if (view === 'trash') {
          const settings = await fetchPageSettings(accessToken);
          setRetentionDays(settings.days ?? 30);
        }
        const data = await fetchPages(accessToken, view === 'trash' ? { trashed: true } : undefined);
        setPages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pages');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken, view]);

  const recentPages = useMemo(
    () => pages.slice().sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')),
    [pages],
  );

  const handleSaveRetention = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsSavingRetention(true);
    setNotice(null);
    try {
      const next = await updatePageSettings(accessToken, retentionDays);
      setRetentionDays(next.days);
      setNotice(`Retention updated to ${next.days} days.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update retention');
    } finally {
      setIsSavingRetention(false);
    }
  };

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

  const handleDelete = async (event: React.MouseEvent, page: PageSummary) => {
    event.stopPropagation();
    if (!accessToken) return;
    setNotice(null);
    if (view === 'trash') {
      if (!window.confirm(`Permanently delete "${page.title}"? This cannot be undone.`)) {
        return;
      }
      setForceDeletingId(page.id);
      try {
        await forceDeletePage(accessToken, page.id);
        setPages((prev) => prev.filter((p) => p.id !== page.id));
        setNotice(`"${page.title}" was permanently removed.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to permanently delete page');
      } finally {
        setForceDeletingId(null);
      }
      return;
    }

    if (!window.confirm(`Move "${page.title}" to trash?`)) {
      return;
    }
    setDeletingId(page.id);
    setError(null);
    try {
      await deletePage(accessToken, page.id);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
      setNotice(`"${page.title}" moved to trash.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (event: React.MouseEvent, page: PageSummary) => {
    event.stopPropagation();
    if (!accessToken) return;
    setRestoringId(page.id);
    setError(null);
    setNotice(null);
    try {
      await restorePage(accessToken, page.id);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
      setNotice(`"${page.title}" restored.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore page');
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <AdminLayout
      title="Pages & Layouts"
      description="Every public page lives here. Pick one to edit sections, copy, and SEO before publishing."
    >
      <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
        <div className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#B15C5C]">All pages</p>
              <p className="text-xs text-[#6B4E3D]/80">
                {view === 'trash'
                  ? 'Recently deleted pages live here for 30 days (or your configured retention).'
                  : 'Click a row to edit metadata and sections.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView('active')}
                className={`rounded-full px-4 py-1 text-sm font-semibold ${
                  view === 'active'
                    ? 'bg-[#2F1E1A] text-white'
                    : 'bg-[#F7EFE3] text-[#6B4E3D] hover:bg-[#F2E6D0]'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setView('trash')}
                className={`rounded-full px-4 py-1 text-sm font-semibold ${
                  view === 'trash'
                    ? 'bg-[#2F1E1A] text-white'
                    : 'bg-[#F7EFE3] text-[#6B4E3D] hover:bg-[#F2E6D0]'
                }`}
              >
                Trash
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#6B4E3D]/70">
            <span>{pages.length} total</span>
            {notice && <span className="text-green-700">{notice}</span>}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left text-[#2F1E1A]">
              <thead className="bg-[#FDF5EA] text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
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
                      className={`border-t border-[#F5EDE2] ${
                        view === 'active' ? 'hover:bg-[#FFF9F2] cursor-pointer' : ''
                      }`}
                      onClick={() => {
                        if (view === 'active') {
                          navigate(`/admin/pages/${page.id}`);
                        }
                      }}
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
                      <td className="px-4 py-3 text-right space-x-2">
                        {view === 'trash' ? (
                          <>
                            <button
                              type="button"
                              onClick={(event) => handleRestore(event, page)}
                              disabled={restoringId === page.id}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#CFE8D7] px-3 py-1 text-xs font-semibold text-[#1E7A55] hover:bg-[#EAF7EF] disabled:opacity-50"
                            >
                              <RotateCcw size={14} />
                              {restoringId === page.id ? 'Restoring…' : 'Restore'}
                            </button>
                            <button
                              type="button"
                              onClick={(event) => handleDelete(event, page)}
                              disabled={forceDeletingId === page.id}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#F0D7C8] px-3 py-1 text-xs font-semibold text-[#8B2332] hover:bg-[#FEF2EC] disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              {forceDeletingId === page.id ? 'Deleting…' : 'Delete forever'}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={(event) => handleDelete(event, page)}
                            disabled={deletingId === page.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#F0D7C8] px-3 py-1 text-xs font-semibold text-[#8B2332] hover:bg-[#FEF2EC] disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {deletingId === page.id ? 'Deleting…' : 'Delete'}
                          </button>
                        )}
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

        <div className="rounded-2xl border border-[#F0E7DA] bg-gradient-to-br from-[#FFF8EE] to-white p-5 space-y-6">
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

          <div className="border-t border-[#F0E7DA] pt-4">
            <p className="text-sm uppercase tracking-wide text-[#B15C5C] flex items-center gap-2">
              <Clock size={16} /> Trash retention
            </p>
            <p className="text-xs text-[#6B4E3D]/80">
              Deleted pages stay in trash for this many days before they are purged automatically.
            </p>
            <form className="mt-3 flex items-center gap-3" onSubmit={handleSaveRetention}>
              <input
                type="number"
                min={1}
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-24 rounded-xl border border-[#E7DED1] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#2F1E1A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={isSavingRetention}
              >
                {isSavingRetention ? 'Saving…' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

