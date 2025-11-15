import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPinned, NotebookPen, Palette } from 'lucide-react';
import { useAuth } from '../auth-context';

type AdminLayoutProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  description?: string;
};

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { label: 'Routes', icon: MapPinned, href: '/admin/routes' },
  { label: 'Pages', icon: NotebookPen, href: '/admin/pages' },
  { label: 'Media', icon: Palette, href: '/admin/media' },
];

export function AdminLayout({ title, description, actions, children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex">
      <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-white/90 via-[#FBF4EB]/90 to-[#F3E5D5]/90 border-r border-[#E0D5C6] px-6 py-8 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#B15C5C]">APECK</p>
          <p className="text-2xl font-semibold text-[#2F1E1A]">Content Studio</p>
          <p className="text-sm text-[#6B4E3D]/70 mt-1">Control every public page from here.</p>
        </div>
        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#2F1E1A] text-white shadow-lg shadow-[#2F1E1A]/20'
                    : 'text-[#6B4E3D] hover:bg-white/80'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto pt-8 border-t border-white/60">
          <div className="rounded-2xl bg-[#2F1E1A] text-white p-4">
            <p className="text-sm font-semibold">Need content migrations?</p>
            <p className="text-xs text-white/70 mt-1">Share a draft and we’ll import it in minutes.</p>
            <a
              href="mailto:info@apeck.org"
              className="inline-flex mt-4 text-xs font-semibold uppercase tracking-wide text-[#F6D68F]"
            >
              Request help →
            </a>
          </div>
          <button
            type="button"
            className="mt-6 w-full rounded-xl border border-[#B15C5C]/50 py-2 text-sm text-[#8B2332] hover:bg-white/70 transition"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FDF8F1] via-[#F7F0E7] to-[#F1E5D6]">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#E0D5C6]/60 bg-white/70 backdrop-blur px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#B15C5C]">Admin</p>
            <p className="text-lg font-semibold text-[#2F1E1A]">
              {user ? `${user.firstName} ${user.lastName}` : 'APECK team'}
            </p>
            <p className="text-sm text-[#6B4E3D]/80">Ready to stage the next update?</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm font-medium text-[#6B4E3D] hover:border-[#8B2332] hover:text-[#8B2332]"
            >
              View public site
            </a>
            {actions}
          </div>
        </header>

        <main className="flex-1 px-6 py-8 space-y-6">
          {(title || description) && (
            <div>
              {title && <h1 className="text-3xl font-semibold text-[#2F1E1A]">{title}</h1>}
              {description && <p className="text-sm text-[#6B4E3D]/80 mt-2">{description}</p>}
            </div>
          )}
          <div className="bg-white/90 rounded-3xl shadow-xl shadow-[#E7DED1]/60 border border-[#F0E7DA] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

