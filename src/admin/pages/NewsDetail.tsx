import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Loader2, Save, Sparkles, Trash2 } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import { deleteNews, fetchNewsDetail, NewsDetail, publishNews, updateNews } from '../api';
import { ImageFieldEditor } from '../components/ImageField';

export function AdminNewsDetail() {
  const { newsId } = useParams<{ newsId: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !newsId) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchNewsDetail(accessToken, newsId);
        setFormState(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken, newsId]);

  const handleChange = (field: keyof NewsDetail, value: string | number | boolean) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken || !newsId || !formState) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateNews(accessToken, newsId, {
        title: formState.title,
        slug: formState.slug,
        excerpt: formState.excerpt,
        body: formState.body,
        heroImageUrl: formState.heroImageUrl,
        status: formState.status as 'draft' | 'scheduled' | 'published',
        heroMediaId: undefined,
        showOnHome: formState.showOnHome,
        homeDisplayOrder: formState.homeDisplayOrder,
        readingTime: formState.readingTime,
        publishedAt: formState.publishedAt,
      });
      setFormState(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!accessToken || !newsId) return;
    setIsPublishing(true);
    setError(null);
    try {
      const updated = await publishNews(accessToken, newsId);
      setFormState(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish article');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !newsId) return;
    const confirmed = window.confirm('Delete this article? This cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteNews(accessToken, newsId);
      navigate('/admin/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  if (!newsId) {
    return (
      <AdminLayout title="News editor">
        <p className="text-sm text-red-600">Missing article id.</p>
      </AdminLayout>
    );
  }

  if (isLoading || !formState) {
    return (
      <AdminLayout title="Loading article">
        <p className="text-sm text-[#6B4E3D]">Fetching news details…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editing ${formState.title}`}
      description="Update copy, imagery, and publishing options for this article."
      actions={
        <button
          type="button"
          onClick={() => navigate('/admin/news')}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm text-[#6B4E3D]"
        >
          <ArrowLeft size={14} />
          Back to news
        </button>
      }
    >
      <form className="space-y-6" onSubmit={handleSave}>
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-5 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Title</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Slug</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ImageFieldEditor
              label="Hero image"
              value={formState.heroImageUrl ?? ''}
              onChange={(value) => handleChange('heroImageUrl', value)}
              accessToken={accessToken}
            />
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-wide text-[#6B4E3D]/70">Reading time</label>
              <input
                className="rounded-xl border border-[#E7DED1] px-4 py-2"
                placeholder="5 min read"
                value={formState.readingTime ?? ''}
                onChange={(e) => handleChange('readingTime', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Excerpt</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
              rows={2}
              value={formState.excerpt ?? ''}
              onChange={(e) => handleChange('excerpt', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Body</label>
            <textarea
              className="mt-1 w-full rounded-2xl border border-[#E7DED1] px-4 py-3 font-mono text-sm"
              rows={12}
              value={formState.body}
              onChange={(e) => handleChange('body', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Status</label>
              <select
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Publish date</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.publishedAt ? formState.publishedAt.slice(0, 16) : ''}
                onChange={(e) => handleChange('publishedAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#6B4E3D] font-semibold">
              <input
                type="checkbox"
                checked={formState.showOnHome}
                onChange={(e) => handleChange('showOnHome', e.target.checked)}
                className="rounded border-[#E7DED1] text-[#8B2332] focus:ring-[#8B2332]"
              />
              Feature on homepage
            </label>
            {formState.showOnHome && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#6B4E3D]/80">Order</span>
                <input
                  type="number"
                  className="w-20 rounded-xl border border-[#E7DED1] px-3 py-1"
                  value={formState.homeDisplayOrder}
                  onChange={(e) => handleChange('homeDisplayOrder', Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F1E1A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> Save changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm font-semibold text-[#6B4E3D]"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Publishing…
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Publish now
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}


