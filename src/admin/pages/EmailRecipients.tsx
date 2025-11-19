import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Mail, PenLine, Plus, RefreshCcw, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import {
  EmailRecipientPayload,
  EmailRecipientResponse,
  createEmailRecipient,
  deleteEmailRecipient,
  fetchEmailRecipients,
  updateEmailRecipient,
} from '../api';

const initialForm: EmailRecipientPayload = {
  email: '',
  name: '',
  type: 'membership',
  isActive: true,
  displayOrder: 0,
};

export function AdminEmailRecipientsPage() {
  const { accessToken } = useAuth();
  const [recipients, setRecipients] = useState<EmailRecipientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, setCreateForm] = useState<EmailRecipientPayload>(initialForm);
  const [editingRecipient, setEditingRecipient] = useState<EmailRecipientResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [mutationSuccess, setMutationSuccess] = useState<string | null>(null);

  const loadRecipients = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const data = await fetchEmailRecipients(accessToken);
      setRecipients(data);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to load email recipients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRecipients();
  }, [accessToken]);

  const sortedRecipients = useMemo(
    () =>
      [...recipients].sort((a, b) => {
        if (a.type !== b.type) {
          return a.type.localeCompare(b.type);
        }
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return a.email.localeCompare(b.email);
      }),
    [recipients],
  );

  const membershipRecipients = useMemo(
    () => sortedRecipients.filter((r) => r.type === 'membership'),
    [sortedRecipients],
  );

  const generalRecipients = useMemo(
    () => sortedRecipients.filter((r) => r.type === 'general'),
    [sortedRecipients],
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
    setMutationSuccess(null);
    try {
      await createEmailRecipient(token, createForm);
      setCreateForm(initialForm);
      setMutationSuccess('Email recipient added successfully.');
      await loadRecipients();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to create email recipient');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = ensureToken();
    if (!token || !editingRecipient) return;
    setIsSaving(true);
    setMutationError(null);
    setMutationSuccess(null);
    try {
      await updateEmailRecipient(token, editingRecipient.id, {
        email: editingRecipient.email,
        name: editingRecipient.name,
        type: editingRecipient.type,
        isActive: editingRecipient.isActive,
        displayOrder: editingRecipient.displayOrder,
      });
      setMutationSuccess('Email recipient updated.');
      setEditingRecipient(null);
      await loadRecipients();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update email recipient');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (recipient: EmailRecipientResponse) => {
    const token = ensureToken();
    if (!token) return;
    setMutationError(null);
    setMutationSuccess(null);
    try {
      await updateEmailRecipient(token, recipient.id, { isActive: !recipient.isActive });
      setMutationSuccess(`Email recipient ${recipient.isActive ? 'disabled' : 'activated'}.`);
      await loadRecipients();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to toggle email recipient');
    }
  };

  const handleDelete = async (recipient: EmailRecipientResponse) => {
    const token = ensureToken();
    if (!token) return;
    const confirmed = window.confirm(`Delete email recipient ${recipient.email}?`);
    if (!confirmed) return;
    setMutationError(null);
    setMutationSuccess(null);
    try {
      await deleteEmailRecipient(token, recipient.id);
      setMutationSuccess('Email recipient deleted.');
      await loadRecipients();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to delete email recipient');
    }
  };

  const startEdit = (recipient: EmailRecipientResponse) => {
    setEditingRecipient({ ...recipient });
    setMutationError(null);
    setMutationSuccess(null);
  };

  const cancelEdit = () => {
    setEditingRecipient(null);
    setMutationError(null);
    setMutationSuccess(null);
  };

  return (
    <AdminLayout
      title="Email Recipients"
      description="Manage email addresses that receive membership application notifications"
    >
      {(mutationError || mutationSuccess) && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            mutationError
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          {mutationError || mutationSuccess}
        </div>
      )}

      <div className="space-y-8">
        {/* Create Form */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#2F1E1A] flex items-center gap-2">
            <Plus size={20} />
            Add New Recipient
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#6B4E3D]">Email Address *</span>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full rounded-xl border border-[#CAB9A7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                  placeholder="recipient@apeck.org"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#6B4E3D]">Name (Optional)</span>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full rounded-xl border border-[#CAB9A7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                  placeholder="John Doe"
                />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#6B4E3D]">Type *</span>
                <select
                  required
                  value={createForm.type}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      type: e.target.value as 'membership' | 'general',
                    })
                  }
                  className="w-full rounded-xl border border-[#CAB9A7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                >
                  <option value="membership">Membership Applications</option>
                  <option value="general">General</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#6B4E3D]">Display Order</span>
                <input
                  type="number"
                  min="0"
                  value={createForm.displayOrder}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-[#CAB9A7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                />
              </label>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-[#8B2332] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#7A1E2A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Adding...' : 'Add Recipient'}
              </button>
            </div>
          </form>
        </section>

        {/* Membership Recipients */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#2F1E1A] flex items-center gap-2">
            <Mail size={20} />
            Membership Application Recipients ({membershipRecipients.length})
          </h2>
          {isLoading ? (
            <div className="text-center py-8 text-[#6B4E3D]">Loading...</div>
          ) : membershipRecipients.length === 0 ? (
            <div className="text-center py-8 text-[#6B4E3D]">
              No membership recipients configured. Emails will be sent to the default address from
              environment variables.
            </div>
          ) : (
            <div className="space-y-3">
              {membershipRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center justify-between rounded-xl border border-[#CAB9A7] bg-white/80 p-4"
                >
                  {editingRecipient?.id === recipient.id ? (
                    <form onSubmit={handleEditSubmit} className="flex-1 space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="email"
                          required
                          value={editingRecipient.email}
                          onChange={(e) =>
                            setEditingRecipient({ ...editingRecipient, email: e.target.value })
                          }
                          className="rounded-lg border border-[#CAB9A7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        />
                        <input
                          type="text"
                          value={editingRecipient.name || ''}
                          onChange={(e) =>
                            setEditingRecipient({ ...editingRecipient, name: e.target.value })
                          }
                          className="rounded-lg border border-[#CAB9A7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          placeholder="Name (optional)"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="rounded-lg bg-[#8B2332] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#7A1E2A] disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-lg border border-[#CAB9A7] px-4 py-1.5 text-xs font-medium text-[#6B4E3D] hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium text-[#2F1E1A]">{recipient.email}</div>
                        {recipient.name && (
                          <div className="text-sm text-[#6B4E3D]">{recipient.name}</div>
                        )}
                        <div className="text-xs text-[#6B4E3D]/70 mt-1">
                          Order: {recipient.displayOrder}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(recipient)}
                          className="p-2 rounded-lg hover:bg-[#F4EFE6]"
                          title={recipient.isActive ? 'Disable' : 'Enable'}
                        >
                          {recipient.isActive ? (
                            <ToggleRight size={20} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={20} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(recipient)}
                          className="p-2 rounded-lg hover:bg-[#F4EFE6] text-[#6B4E3D]"
                          title="Edit"
                        >
                          <PenLine size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(recipient)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* General Recipients */}
        {generalRecipients.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-[#2F1E1A] flex items-center gap-2">
              <Mail size={20} />
              General Recipients ({generalRecipients.length})
            </h2>
            <div className="space-y-3">
              {generalRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center justify-between rounded-xl border border-[#CAB9A7] bg-white/80 p-4"
                >
                  <div className="flex-1">
                    <div className="font-medium text-[#2F1E1A]">{recipient.email}</div>
                    {recipient.name && (
                      <div className="text-sm text-[#6B4E3D]">{recipient.name}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(recipient)}
                      className="p-2 rounded-lg hover:bg-[#F4EFE6]"
                    >
                      {recipient.isActive ? (
                        <ToggleRight size={20} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={20} className="text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => startEdit(recipient)}
                      className="p-2 rounded-lg hover:bg-[#F4EFE6] text-[#6B4E3D]"
                    >
                      <PenLine size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(recipient)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center gap-2 text-sm text-[#6B4E3D]/70">
          <RefreshCcw size={16} />
          <button onClick={loadRecipients} className="hover:text-[#8B2332]">
            Refresh list
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

