import { useEffect } from 'react';
import { CalendarRange, ListChecks, MapPinned, NotebookPen } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';

const roadmapItems = [
  {
    title: 'Page builder',
    detail: 'Edit hero + section content per page, push to draft/publish.',
    eta: 'Sprint 2',
  },
  {
    title: 'Programs library',
    detail: 'Manage program cards, detail narratives, and hero media.',
    eta: 'Sprint 3',
  },
  {
    title: 'News & events',
    detail: 'Create announcements with scheduled publishing.',
    eta: 'Sprint 3',
  },
];

export function AdminDashboard() {
  const { user, routes, reloadRoutes, isLoadingRoutes } = useAuth();

  useEffect(() => {
    if (!routes.length) {
      void reloadRoutes();
    }
  }, [reloadRoutes, routes.length]);

  const quickStats = [
    {
      label: 'Live routes',
      value: isLoadingRoutes ? '—' : routes.length.toString(),
      subtext: 'Linked from React Router',
      icon: MapPinned,
    },
    {
      label: 'Page layouts',
      value: '8 templates',
      subtext: 'Home, About, Programs…',
      icon: NotebookPen,
    },
    {
      label: 'Upcoming modules',
      value: '5 collections',
      subtext: 'Pages, news, programs, events, media',
      icon: ListChecks,
    },
  ];

  return (
    <AdminLayout
      title={`Welcome back, ${user ? user.firstName : 'team'}`}
      description="Here’s the pulse of your content system. Use these blocks to plan the next CMS rollout and keep the public site in sync."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#F0E7DA] bg-gradient-to-br from-[#FFF8EE] to-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-wide text-[#B15C5C]">{stat.label}</p>
                  <Icon className="text-[#B15C5C]" size={18} />
                </div>
                <p className="mt-3 text-3xl font-semibold text-[#2F1E1A]">{stat.value}</p>
                <p className="text-sm text-[#6B4E3D]/80 mt-1">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#F0E7DA] bg-[#2F1E1A] text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-wide text-[#F6D68F]">Content pipeline</p>
              <p className="mt-2 text-2xl font-semibold">CMS rollout roadmap</p>
              <p className="mt-3 text-sm text-white/80">
                We’re sequencing the next blocks so editors can control every section without touching code.
              </p>
              <div className="mt-6 space-y-5">
                {roadmapItems.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/15">
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="text-sm text-white/80 mt-1">{item.detail}</p>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#F6D68F] mt-3">
                      <CalendarRange size={14} />
                      {item.eta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#F0E7DA] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-[#B15C5C]">Live route map</p>
                <p className="text-lg font-semibold text-[#2F1E1A]">How visitors reach pages</p>
              </div>
              <button
                type="button"
                onClick={() => reloadRoutes()}
                className="rounded-xl border border-[#CAB9A7] px-3 py-2 text-xs font-semibold text-[#6B4E3D] hover:text-[#8B2332]"
              >
                Refresh data
              </button>
            </div>
            {isLoadingRoutes ? (
              <p className="mt-6 text-sm text-[#6B4E3D]">Loading routes…</p>
            ) : (
              <div className="mt-6 space-y-3 max-h-72 overflow-auto pr-2">
                {routes.map((route) => (
                  <div
                    key={route.slug}
                    className="flex items-center justify-between rounded-2xl border border-[#F0E7DA] bg-[#FFFDF9] px-4 py-3 text-sm text-[#2F1E1A]"
                  >
                    <span className="font-medium">/{route.slug}</span>
                    <span className="text-[#6B4E3D]/70 truncate max-w-[55%] text-right">→ {route.target}</span>
                  </div>
                ))}
                {!routes.length && <p className="text-sm text-[#6B4E3D]">No routes have been seeded yet.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

