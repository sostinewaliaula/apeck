import { useEffect } from 'react';
import { AlertTriangle, PenLine, RefreshCcw } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';

export function AdminRoutesPage() {
  const { routes, reloadRoutes, isLoadingRoutes, authError } = useAuth();

  useEffect(() => {
    void reloadRoutes();
  }, [reloadRoutes]);

  return (
    <AdminLayout
      title="Dynamic route aliases"
      description="These slugs are what the public React Router uses. Soon you’ll be able to add, reorder, or remap routes directly from this panel."
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
      {isLoadingRoutes ? (
        <p className="text-sm text-[#6B4E3D]">Loading routes…</p>
      ) : authError ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} />
          {authError}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-dashed border-[#E0D5C6] bg-[#FFF8EE] px-4 py-3 text-sm text-[#6B4E3D] flex items-center gap-3">
            <PenLine size={16} className="text-[#B15C5C]" />
            Editing controls are next. For now, routes mirror what’s in the database migration and seed.
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#F0E7DA]">
            <table className="w-full text-sm text-left text-[#2F1E1A]">
              <thead className="bg-[#FDF5EA] text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                <tr>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Targets</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.slug} className="border-t border-[#F5EDE2]">
                    <td className="px-4 py-3 font-semibold">/{route.slug}</td>
                    <td className="px-4 py-3 text-[#6B4E3D]/80">{route.target}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="rounded-full bg-[#E6F6EF] text-[#1E7A55] px-3 py-1 text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {!routes.length && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-[#6B4E3D]">
                      No routes configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

