import { useEffect, useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import { changePassword, updateProfile } from '../api';

export function AdminProfilePage() {
  const { user, accessToken, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    });
  }, [user]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsSavingProfile(true);
    setProfileStatus(null);
    try {
      await updateProfile(accessToken, profileForm);
      await refreshProfile();
      setProfileStatus('Profile updated successfully.');
    } catch (err) {
      setProfileStatus(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus('New passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    setPasswordStatus(null);
    try {
      await changePassword(accessToken, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordStatus('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <AdminLayout
      title="My Profile"
      description="Update your account details and keep your credentials secure."
      actions={
        <div className="inline-flex items-center gap-2 rounded-xl bg-[#2F1E1A] px-4 py-2 text-white text-sm">
          <ShieldCheck size={16} />
          Signed in as {user?.role ?? 'member'}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#F5D4C1] bg-[#FFF9F5] p-5">
          <h2 className="text-lg font-semibold text-[#2F1E1A]">Account details</h2>
          <p className="text-sm text-[#6B4E3D]/80">These details appear on content you publish.</p>
          <form className="mt-4 space-y-3" onSubmit={handleProfileSubmit}>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              First name
              <input
                type="text"
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Last name
              <input
                type="text"
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Email address
              <input
                type="email"
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={profileForm.email}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
            {profileStatus && (
              <p className={`text-sm ${profileStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {profileStatus}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B2332] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6C1B28] disabled:opacity-60"
              disabled={isSavingProfile}
            >
              {isSavingProfile && <Loader2 className="animate-spin" size={16} />}
              Save changes
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-[#E7D8C5] bg-white p-5">
          <h2 className="text-lg font-semibold text-[#2F1E1A]">Password</h2>
          <p className="text-sm text-[#6B4E3D]/80">Use at least 8 characters with a mix of letters and numbers.</p>
          <form className="mt-4 space-y-3" onSubmit={handlePasswordSubmit}>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Current password
              <input
                type="password"
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              New password
              <input
                type="password"
                minLength={8}
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm font-medium text-[#4B2F24] space-y-1 block">
              Confirm new password
              <input
                type="password"
                minLength={8}
                className="w-full rounded-xl border border-[#E4D7C7] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2332]/30"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </label>
            {passwordStatus && (
              <p className={`text-sm ${passwordStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {passwordStatus}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F1E1A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1F120E] disabled:opacity-60"
              disabled={isSavingPassword}
            >
              {isSavingPassword && <Loader2 className="animate-spin" size={16} />}
              Update password
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}

