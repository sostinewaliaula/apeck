import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, MapPin, Plus } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import { AdminEvent, createEvent, deleteEvent, fetchAdminEvents, publishEvent, updateEvent, EventPayload } from '../api';
import { ImageFieldEditor } from '../components/ImageField';

const initialForm: EventPayload = {
  title: '',
  slug: '',
  description: '',
  status: 'draft',
  startDate: '',
  endDate: '',
  location: '',
  category: '',
  coverImageUrl: '',
};

export function AdminEventsList() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState(initialForm);
  const navigate = useNavigate();

  const loadEvents = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const data = await fetchAdminEvents(accessToken);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: EventPayload = {
        title: createForm.title.trim(),
        slug: createForm.slug?.trim() || undefined,
        description: createForm.description?.trim() || undefined,
        status: createForm.status,
        startDate: createForm.startDate,
        endDate: createForm.endDate || undefined,
        location: createForm.location?.trim() || undefined,
        category: createForm.category?.trim() || undefined,
        coverImageUrl: createForm.coverImageUrl?.trim() || undefined,
      };
      const created = await createEvent(accessToken, payload);
      setCreateForm(initialForm);
      setItems((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (item: AdminEvent) => {
    if (!accessToken) return;
    try {
      const updated = await publishEvent(accessToken, item.id);
      setItems((prev) => prev.map((e) => (e.id === item.id ? updated : e)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish event');
    }
  };

  const handleDelete = async (item: AdminEvent) => {
    if (!accessToken) return;
    const confirmed = window.confirm(`Delete event "${item.title}"?`);
    if (!confirmed) return;
    try {
      await deleteEvent(accessToken, item.id);
      setItems((prev) => prev.filter((e) => e.id !== item.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  return (
    <AdminLayout title="Events" description="Manage events that appear on the News & Events page.">
      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="rounded-2xl border border-[#F0E7DA] bg-white/95 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#B15C5C]">All events</p>
              <p className="text-xs text-[#6B4E3D]/80">Create, publish, and remove events.</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[#2F1E1A]">
              <thead className="bg-[#FDF5EA] text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B4E3D]">
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} /> Loading events…
                      </div>
                    </td>
                  </tr>
                ) : items.length ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-t border-[#F5EDE2] hover:bg-[#FFF9F2]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#2F1E1A]">{item.title}</div>
                        <div className="text-xs text-[#6B4E3D]/70">/{item.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-[#6B4E3D]">
                          <Calendar size={14} />
                          <span>
                            {item.startDate}
                            {item.endDate ? ` → ${item.endDate}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-[#6B4E3D]">
                          <MapPin size={14} />
                          <span>{item.location || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                            item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {item.status !== 'published' && (
                          <button
                            className="text-xs rounded-full border px-3 py-1 border-[#8B2332] text-[#8B2332]"
                            onClick={() => handlePublish(item)}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          className="text-xs rounded-full border px-3 py-1 border-red-300 text-red-600"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B4E3D]">
                      No events yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E7DA] bg-white/95 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#B15C5C]">Create Event</p>
              <p className="text-xs text-[#6B4E3D]/80">Add a new upcoming event.</p>
            </div>
            <Plus size={16} className="text-[#8B2332]" />
          </div>
          <form className="space-y-3" onSubmit={handleCreate}>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-[#6B4E3D]">
                Title
                <input
                  className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B2332]"
                  value={createForm.title}
                  onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </label>
              <label className="text-xs text-[#6B4E3D]">
                Slug
                <input
                  className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="annual-leadership-conference"
                />
              </label>
            </div>
            <label className="text-xs text-[#6B4E3D] block">
              Description
              <textarea
                className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm"
                rows={4}
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-[#6B4E3D]">
                Start Date
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm"
                  value={createForm.startDate}
                  onChange={(e) => setCreateForm((f) => ({ ...f, startDate: e.target.value }))}
                  required
                />
              </label>
              <label className="text-xs text-[#6B4E3D]">
                End Date
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm"
                  value={createForm.endDate}
                  onChange={(e) => setCreateForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-[#6B4E3D]">
                Location
                <input
                  className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm"
                  value={createForm.location}
                  onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))}
                />
              </label>
              <label className="text-xs text-[#6B4E3D]">
                Category
                <input
                  className="mt-1 w-full rounded-md border border-[#E7DED1] px-3 py-2 text-sm"
                  value={createForm.category}
                  onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Conference, Workshop…"
                />
              </label>
            </div>
            <ImageFieldEditor
              label="Cover Image"
              value={createForm.coverImageUrl}
              onChange={(url) => setCreateForm((f) => ({ ...f, coverImageUrl: url }))}
              accessToken={accessToken}
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#8B2332] px-4 py-2 text-white text-sm disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

