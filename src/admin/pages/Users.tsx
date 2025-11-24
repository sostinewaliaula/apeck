import { useCallback, useEffect, useMemo, useState } from 'react';
import { Shield, UserPlus, Loader2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import {
  AdminUser,
  UserRole,
  createAdminUser,
  fetchAdminUsers,
  updateAdminUser,
  resendAdminInvite,
} from '../api';

const roleOptions: { label: string; value: UserRole; helper: string }[] = [
  { label: 'Administrator', value: 'admin', helper: 'Full control, can manage users and settings.' },
  { label: 'Editor', value: 'editor', helper: 'Manage content (pages, news, media, events).' },
  { label: 'Viewer', value: 'viewer', helper: 'Read-only access to dashboards.' },
];

export function AdminUsersPage() {
  const { accessToken, user } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendingUserId, setResendingUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'editor' as UserRole,
  });

  const canManage = user?.role === 'admin';

  const loadUsers = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers(accessToken);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      const created = await createAdminUser(accessToken, form);
      setItems((prev) => [created, ...prev]);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'editor',
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (target: AdminUser, nextRole: UserRole) => {
    if (!accessToken || target.role === nextRole) return;
    setNotice(null);
    try {
      const updated = await updateAdminUser(accessToken, target.id, { role: nextRole });
      setItems((prev) => prev.map((item) => (item.id === target.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleToggleActive = async (target: AdminUser) => {
    if (!accessToken) return;
    setNotice(null);
    try {
      const updated = await updateAdminUser(accessToken, target.id, { isActive: !target.isActive });
      setItems((prev) => prev.map((item) => (item.id === target.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleResendInvite = async (target: AdminUser) => {
    if (!accessToken) return;
    setResendingUserId(target.id);
    setNotice(null);
    try {
      await resendAdminInvite(accessToken, target.id);
      setNotice(`Invitation email re-sent to ${target.email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invite');
    } finally {
      setResendingUserId(null);
    }
  };

  const sortedUsers = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.role === b.role) {
          return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
        }
        const rank: Record<UserRole, number> = { admin: 0, editor: 1, viewer: 2 };
        return rank[a.role] - rank[b.role];
      }),
    [items],
  );

  if (!canManage) {
    return (
      <AdminLayout title="Users & Roles">
        <div className="rounded-2xl border border-[#F5D4C1] bg-[#FFF5F0] p-6 text-[#8B2332]">
          <p className="font-semibold">Insufficient permissions</p>
          <p className="text-sm mt-1">
            Only administrators can manage team members. Please contact an administrator if you need access.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Users & Roles"
      description="Invite teammates, promote editors, and keep access limited to trusted members."
      actions={
        <div className="inline-flex items-center gap-2 rounded-xl bg-[#2F1E1A] px-4 py-2 text-white">
          <Shield size={16} />
          Admin only area
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#F5D4C1] bg-[#FFF9F5] p-5">
          <div className="flex items-center gap-2 text-[#8B2332]">
            <UserPlus size={18} />
            <h2 className="font-semibold">Invite a user</h2>
          </div>
          <p className="text-sm text-[#6B4E3D]/80 mt-1">Passwords can be changed later by the user.</p>
          <form className="mt-4 space-y-3" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm font-medium text-[#4B2F24] space-y-1">
                First name
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30 bg-white"
                  value={form.firstName}
                  onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </label>
              <label className="text-sm font-medium text-[#4B2F24] space-y-1">
                Last name
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30 bg-white"
                  value={form.lastName}
                  onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </label>
            </div>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Email
              <input
                type="email"
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30 bg-white"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Temporary password
              <input
                type="password"
                minLength={8}
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30 bg-white"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Role
              <select
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-[#6B4E3D]/70">
              New admins inherit full permissions immediately. Viewers cannot edit anything.
            </p>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B2332] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6C1B28] disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin" size={16} />}
              Invite user
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-[#E7D8C5] bg-white p-5">
          <h2 className="font-semibold text-[#2F1E1A]">Roles explained</h2>
          <div className="mt-3 space-y-3">
            {roleOptions.map((role) => (
              <div key={role.value} className="rounded-xl border border-[#F4E4D2] p-3">
                <p className="font-medium text-[#4B2F24]">{role.label}</p>
                <p className="text-sm text-[#6B4E3D]/80">{role.helper}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[#E7D8C5] bg-white p-5 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#2F1E1A]">Team directory</h2>
            <p className="text-sm text-[#6B4E3D]/80">
              Promote editors or suspend access instantly. Last login shows activity.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="rounded-xl border border-[#E0D5C6] px-4 py-2 text-sm text-[#6B4E3D] hover:border-[#8B2332]"
          >
            Refresh
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        {notice && !error && <p className="text-sm text-green-600 mt-3">{notice}</p>}

        {isLoading ? (
          <div className="flex items-center gap-2 text-[#6B4E3D]/80 mt-6">
            <Loader2 className="animate-spin" size={16} />
            Loading users...
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B4E3D]/70">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Last login</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((item) => (
                  <tr key={item.id} className="border-t border-[#F4E4D2]">
                    <td className="py-3 font-medium text-[#2F1E1A]">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="py-3 text-[#6B4E3D]">{item.email}</td>
                    <td className="py-3">
                      <select
                        className="rounded-lg border border-[#E4D7C7] px-2 py-1 text-sm bg-white"
                        value={item.role}
                        disabled={item.id === user?.id}
                        onChange={(e) => handleRoleChange(item, e.target.value as UserRole)}
                      />
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3 text-[#6B4E3D]/80">
                      {item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        disabled={item.id === user?.id}
                        onClick={() => handleToggleActive(item)}
                        className="text-xs font-semibold rounded-lg border border-[#E0D5C6] px-3 py-1 text-[#8B2332] disabled:opacity-40"
                      >
                        {item.isActive ? 'Suspend' : 'Re-activate'}
                      </button>
                      <button
                        type="button"
                        disabled={item.id === user?.id || resendingUserId === item.id}
                        onClick={() => handleResendInvite(item)}
                        className="text-xs font-semibold rounded-lg border border-[#E0D5C6] px-3 py-1 text-[#2F1E1A] disabled:opacity-40"
                      >
                        {resendingUserId === item.id ? 'Sending…' : 'Resend invite'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedUsers.length === 0 && (
              <p className="text-sm text-center text-[#6B4E3D]/70 py-6">
                No users found. Invite someone using the form above.
              </p>
            )}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

