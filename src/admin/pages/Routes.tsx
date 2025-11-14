import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, PenLine, RefreshCcw, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import { AdminRoute as AdminRouteType, createRoute, deleteRoute, RoutePayload, updateRoute } from '../api';

const initialForm: RoutePayload = {
  slug: '',
  target: '',
  isActive: true,
};

export function AdminRoutesPage() {
  const { routes, reloadRoutes, isLoadingRoutes, authError, accessToken } = useAuth();
  const [createForm, setCreateForm] = useState<RoutePayload>(initialForm);
  const [editingRoute, setEditingRoute] = useState<AdminRouteType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [mutationSuccess, setMutationSuccess] = useState<string | null>(null);

  useEffect(() => {
    void reloadRoutes();
  }, [reloadRoutes]);

  const sortedRoutes = useMemo(
    () =>
      [...routes].sort((a, b) => {
        if (a.isActive !== b.isActive) {
          return a.isActive ? -1 : 1;
        }
        return a.slug.localeCompare(b.slug);
      }),
    [routes],
  );

  const ensureToken = () => {
    if (!accessToken) {
      setMutationError('You are not authenticated. Please sign in again.');
      return null;
    }
    return accessToken;
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const token = ensureToken();
    if (!token) return;
    setIsSaving(true);
    setMutationError(null);
    try {
      await createRoute(token, createForm);
      setCreateForm(initialForm);
      setMutationSuccess('Route added successfully.');
      await reloadRoutes(token);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to create route');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = ensureToken();
    if (!token || !editingRoute) return;
    setIsSaving(true);
    setMutationError(null);
    try {
      await updateRoute(token, editingRoute.id, {
        slug: editingRoute.slug,
        target: editingRoute.target,
        isActive: editingRoute.isActive,
      });
      setMutationSuccess('Route updated.');
      setEditingRoute(null);
      await reloadRoutes(token);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update route');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (route: AdminRouteType) => {
    const token = ensureToken();
    if (!token) return;
    setMutationError(null);
    try {
      await updateRoute(token, route.id, { isActive: !route.isActive });
      setMutationSuccess(`Route ${route.isActive ? 'disabled' : 'activated'}.`);
      await reloadRoutes(token);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to toggle route');
    }
  };

  const handleDelete = async (route: AdminRouteType) => {
    const token = ensureToken();
    if (!token) return;
    const confirmed = window.confirm(`Delete route /${route.slug}?`);
    if (!confirmed) return;
    setMutationError(null);
    try {
      await deleteRoute(token, route.id);
      setMutationSuccess('Route deleted.');
      await reloadRoutes(token);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  return (
    <AdminLayout
      title="Dynamic route aliases"
      description="Create and map friendly slugs to any React view. Disable unused routes or remap them without redeploying the frontend."
      actions={
        <button
          type="button"
          onClick={() => reloadRoutes()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm font-semibold text-[#6B4E3D] hover:text-[#8B2332]"
        >
          <RefreshCcw size={14} />
          Sync latest
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-5">
          {mutationError && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle size={16} />
              {mutationError}
            </div>
          )}
          {mutationSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {mutationSuccess}
            </div>
          )}
          {authError && !mutationError && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle size={16} />
              {authError}
            </div>
          )}
          <div className="overflow-x-auto rounded-2xl border border-[#F0E7DA] bg-white/90">
            <table className="w-full text-sm text-left text-[#2F1E1A]">
              <thead className="bg-[#FDF5EA] text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                <tr>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingRoutes ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[#6B4E3D]">
                      Loading routes…
                    </td>
                  </tr>
                ) : sortedRoutes.length ? (
                  sortedRoutes.map((route) => (
                    <tr key={route.id} className="border-t border-[#F5EDE2]">
                      <td className="px-4 py-3 font-semibold text-[#2F1E1A]">/{route.slug}</td>
                      <td className="px-4 py-3 text-[#6B4E3D]/80">{route.target}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            route.isActive
                              ? 'bg-[#E6F6EF] text-[#1E7A55]'
                              : 'bg-[#FBE9E9] text-[#9F1D2D]'
                          }`}
                        >
                          {route.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-[#CAB9A7] px-3 py-1 text-xs text-[#6B4E3D] hover:text-[#8B2332]"
                          onClick={() => setEditingRoute(route)}
                        >
                          <PenLine size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-[#CAB9A7] px-3 py-1 text-xs text-[#6B4E3D] hover:text-[#8B2332]"
                          onClick={() => handleToggle(route)}
                        >
                          {route.isActive ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                          {route.isActive ? 'Disable' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(route)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[#6B4E3D]">
                      No routes configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#F0E7DA] bg-gradient-to-br from-[#FFF8EE] to-white p-5">
            <h3 className="text-lg font-semibold text-[#2F1E1A]">Add new route</h3>
            <p className="text-sm text-[#6B4E3D]/80">Point a fresh slug to any existing React screen or alias.</p>
            <form className="mt-4 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Slug</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[#E7DED1] bg-white/80 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                  placeholder="about"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Target</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[#E7DED1] bg-white/80 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                  placeholder="/about"
                  value={createForm.target}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, target: e.target.value }))}
                  required
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-[#2F1E1A]">
                <input
                  type="checkbox"
                  checked={createForm.isActive}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-[#CAB9A7] text-[#8B2332] focus:ring-[#8B2332]"
                />
                Active immediately
              </label>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-[#8B2332] py-2 text-sm font-semibold text-white hover:bg-[#761c29] disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Create route'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-[#F0E7DA] bg-white p-5">
            <h3 className="text-lg font-semibold text-[#2F1E1A]">Edit selected route</h3>
            {editingRoute ? (
              <form className="mt-4 space-y-4" onSubmit={handleEditSubmit}>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Slug</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                    value={editingRoute.slug}
                    onChange={(e) => setEditingRoute({ ...editingRoute, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Target</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                    value={editingRoute.target}
                    onChange={(e) => setEditingRoute({ ...editingRoute, target: e.target.value })}
                    required
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-[#2F1E1A]">
                  <input
                    type="checkbox"
                    checked={editingRoute.isActive}
                    onChange={(e) => setEditingRoute({ ...editingRoute, isActive: e.target.checked })}
                    className="rounded border-[#CAB9A7] text-[#8B2332] focus:ring-[#8B2332]"
                  />
                  Active
                </label>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-[#2F1E1A] py-2 text-sm font-semibold text-white hover:bg-[#201511] disabled:opacity-60"
                  >
                    {isSaving ? 'Updating…' : 'Save changes'}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm text-[#6B4E3D]"
                    onClick={() => setEditingRoute(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-3 text-sm text-[#6B4E3D]/80">Select a route from the table to edit its mapping.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

