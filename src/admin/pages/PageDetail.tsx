import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Braces, Check, Save, Trash2, Plus, Trash } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import {
  deletePageSection,
  fetchPageDetail,
  PageDetail,
  PageSection,
  publishPage,
  updatePage,
  updatePageSection,
  createPageSection,
} from '../api';
import { getSectionSchema, SECTION_SCHEMAS, SectionField } from '../sections/schema';
import { ImageFieldEditor } from '../components/ImageField';

const blankNewSection = {
  key: '',
  displayOrder: 0,
  status: 'draft' as 'draft' | 'published',
};

export function AdminPageDetail() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [page, setPage] = useState<PageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    slug: '',
    excerpt: '',
    seoTitle: '',
    seoDescription: '',
  });
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [newSection, setNewSection] = useState(blankNewSection);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!accessToken || !pageId || pageId === 'undefined') return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchPageDetail(accessToken, pageId);
        setPage(data);
        setFormState({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt ?? '',
          seoTitle: data.seoTitle ?? '',
          seoDescription: data.seoDescription ?? '',
        });
        const drafts: Record<string, Record<string, unknown>> = {};
        data.sections.forEach((section) => {
          drafts[section.id] = section.content ?? {};
        });
        setSectionDrafts(drafts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken, pageId]);

  const orderedSections = useMemo(
    () => (page ? [...page.sections].sort((a, b) => a.displayOrder - b.displayOrder) : []),
    [page],
  );

  const updateMeta = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken || !pageId) return;
    setIsSavingMeta(true);
    try {
      const updated = await updatePage(accessToken, pageId, {
        ...formState,
      });
      setPage((prev) => (prev ? { ...prev, ...updated } : prev));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update page');
    } finally {
      setIsSavingMeta(false);
    }
  };

  const updateDraftField = (sectionId: string, path: string[], value: unknown) => {
    setSectionDrafts((prev) => {
      const draft = JSON.parse(JSON.stringify(prev[sectionId] ?? {})) as Record<string, unknown>;
      setValueInDraft(draft, path, value);
      return { ...prev, [sectionId]: draft };
    });
  };

  const saveSection = async (section: PageSection) => {
    if (!pageId || !accessToken) return;
    try {
    const draft = sectionDrafts[section.id] ?? {};
      const updated = await updatePageSection(accessToken, section.id, {
        key: section.key,
        displayOrder: section.displayOrder,
        status: section.status,
        content: draft,
      });
      setPage((prev) =>
        prev
          ? {
              ...prev,
              sections: prev.sections.map((s) => (s.id === section.id ? updated : s)),
            }
          : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    }
  };

  const removeSection = async (sectionId: string) => {
    if (!pageId || !accessToken) return;
    const confirmed = window.confirm('Delete this section?');
    if (!confirmed) return;
    try {
      await deletePageSection(accessToken, sectionId);
      setPage((prev) =>
        prev ? { ...prev, sections: prev.sections.filter((section) => section.id !== sectionId) } : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete section');
    }
  };

  const addSection = async (event: FormEvent) => {
    event.preventDefault();
    if (!pageId || !accessToken || !newSection.key) {
      setError('Select a section type before adding.');
      return;
    }
    try {
      const schema = getSectionSchema(newSection.key);
      const initialContent =
        schema?.fields.reduce<Record<string, unknown>>((acc, field) => {
          if (field.type === 'repeatable') {
            acc[field.name] = [];
          } else if (field.type === 'link') {
            acc[field.name] = field.fields.reduce<Record<string, string>>((linkAcc, linkField) => {
              linkAcc[linkField.name] = '';
              return linkAcc;
            }, {});
          } else if ('name' in field) {
            acc[field.name] = '';
          }
          return acc;
        }, {}) ?? {};
      const created = await createPageSection(accessToken, pageId, {
        key: newSection.key,
        displayOrder: Number(newSection.displayOrder) || 0,
        status: newSection.status as 'draft' | 'published',
        content: initialContent,
      });
      setPage((prev) => (prev ? { ...prev, sections: [...prev.sections, created] } : prev));
      setSectionDrafts((prev) => ({
        ...prev,
        [created.id]: created.content ?? {},
      }));
      setNewSection(blankNewSection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add section');
    }
  };

  const handlePublish = async () => {
    if (!pageId || !accessToken) return;
    setIsPublishing(true);
    try {
      const updated = await publishPage(accessToken, pageId);
      setPage((prev) => (prev ? { ...prev, ...updated, sections: prev.sections.map((s) => ({ ...s, status: 'published' })) } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!pageId || pageId === 'undefined') {
    return (
      <AdminLayout>
        <p className="text-sm text-red-600">Page ID missing.</p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm text-[#6B4E3D]"
          onClick={() => navigate('/admin/pages')}
        >
          <ArrowLeft size={14} />
          Back to pages
        </button>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout title="Loading page">
        <p className="text-sm text-[#6B4E3D]">Fetching page details…</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Page editor">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm text-[#6B4E3D]"
          onClick={() => navigate('/admin/pages')}
        >
          <ArrowLeft size={14} />
          Back to pages
        </button>
      </AdminLayout>
    );
  }

  if (!page) {
    return (
      <AdminLayout title="Page editor">
        <p className="text-sm text-[#6B4E3D]">Page not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editing ${page.title}`}
      description="Update hero copy, SEO, and sections. Publish when you’re ready to push the homepage live."
      actions={
        <button
          type="button"
          onClick={() => navigate('/admin/pages')}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm text-[#6B4E3D]"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      }
    >
      <div className="space-y-6">
        <form className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-5 space-y-4" onSubmit={updateMeta}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Title</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.title}
                onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Slug</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.slug}
                onChange={(e) => setFormState((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>
            <div className="w-full md:flex-1">
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Excerpt</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                rows={2}
                value={formState.excerpt}
                onChange={(e) => setFormState((prev) => ({ ...prev, excerpt: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">SEO Title</label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                value={formState.seoTitle}
                onChange={(e) => setFormState((prev) => ({ ...prev, seoTitle: e.target.value }))}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">SEO Description</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-4 py-2"
                rows={2}
                value={formState.seoDescription}
                onChange={(e) => setFormState((prev) => ({ ...prev, seoDescription: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSavingMeta}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F1E1A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f1410] disabled:opacity-60"
            >
              <Save size={14} />
              {isSavingMeta ? 'Saving…' : 'Save metadata'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center gap-2 rounded-xl border border-[#CAB9A7] px-4 py-2 text-sm font-semibold text-[#6B4E3D]"
            >
              <Check size={14} />
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>
            <span className="text-xs uppercase tracking-wide text-[#6B4E3D]/70">
              Current status: {page.status}
            </span>
          </div>
        </form>

        <div className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#B15C5C]">Sections</p>
              <p className="text-xs text-[#6B4E3D]/80">Hero, stats, CTA, and more.</p>
            </div>
          </div>
          {orderedSections.length === 0 && <p className="text-sm text-[#6B4E3D]">No sections added yet.</p>}
          <div className="space-y-4">
            {orderedSections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-[#E7DED1] bg-[#FFFDF9] p-4 space-y-3">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2F1E1A]">{section.key}</p>
                    <p className="text-xs text-[#6B4E3D]/70">Order #{section.displayOrder}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-xl border border-[#CAB9A7] px-3 py-1 text-xs text-[#6B4E3D]"
                      onClick={() => saveSection(section)}
                    >
                      <Save size={12} />
                      Save section
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1 text-xs text-red-700"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
                {(() => {
                  const schema = getSectionSchema(section.key);
                  if (!schema) {
                    return (
                      <>
                        <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Content (JSON)</label>
                        <textarea
                          className="w-full rounded-xl border border-[#E7DED1] bg-white px-4 py-2 font-mono text-xs"
                          rows={8}
                          value={JSON.stringify(sectionDrafts[section.id] ?? {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setSectionDrafts((prev) => ({ ...prev, [section.id]: parsed }));
                            } catch {
                              // ignore parse error until valid JSON
                            }
                          }}
                        />
                      </>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {schema.fields.map((field) => (
                        <SectionFieldEditor
                          key={`${section.id}-${field.name}`}
                          field={field}
                          sectionId={section.id}
                          draft={sectionDrafts[section.id] ?? {}}
                          onChange={updateDraftField}
                          accessToken={accessToken}
                        />
                      ))}
                    </div>
                  );
                })()}
                <div className="flex flex-wrap gap-3 text-xs text-[#6B4E3D]/80">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F6EF] px-3 py-1 text-[#1E7A55]">
                    <Braces size={12} />
                    {section.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-2xl border border-dashed border-[#F0E7DA] bg-[#FFF8EE] p-5 space-y-3" onSubmit={addSection}>
          <p className="text-sm uppercase tracking-wide text-[#B15C5C]">Add section</p>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Section type</label>
              <select
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                value={newSection.key}
                onChange={(e) => setNewSection((prev) => ({ ...prev, key: e.target.value }))}
                required
              >
                <option value="">Select section</option>
                {SECTION_SCHEMAS.map((schema) => (
                  <option key={schema.key} value={schema.key}>
                    {schema.title}
                  </option>
                ))}
              </select>
              {newSection.key && getSectionSchema(newSection.key)?.description && (
                <p className="text-xs text-[#6B4E3D]/70 mt-1">{getSectionSchema(newSection.key)?.description}</p>
              )}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Order</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                value={newSection.displayOrder}
                onChange={(e) => setNewSection((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">Status</label>
              <select
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                value={newSection.status}
                onChange={(e) => setNewSection((prev) => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B2332] px-4 py-2 text-sm font-semibold text-white hover:bg-[#761c29]"
          >
            Add section
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

type SectionFieldEditorProps = {
  field: SectionField;
  sectionId: string;
  draft: Record<string, unknown>;
  onChange: (sectionId: string, path: string[], value: unknown) => void;
  path?: string[];
  accessToken?: string | null;
};

const SectionFieldEditor = ({ field, sectionId, draft, onChange, path, accessToken }: SectionFieldEditorProps) => {
  const fieldPath = path ?? [field.name];
  if (field.type === 'text') {
    const value = (getValueFromDraft(draft, fieldPath) as string) ?? '';
    return (
      <div>
        <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">{field.label}</label>
        <input
          className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(sectionId, fieldPath, e.target.value)}
        />
      </div>
    );
  }
  if (field.type === 'textarea') {
    const value = (getValueFromDraft(draft, fieldPath) as string) ?? '';
    return (
      <div>
        <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">{field.label}</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
          rows={4}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(sectionId, fieldPath, e.target.value)}
        />
      </div>
    );
  }
  if (field.type === 'image') {
    const value = (getValueFromDraft(draft, fieldPath) as string) ?? '';
    return (
      <ImageFieldEditor
        label={field.label}
        value={value}
        onChange={(next) => onChange(sectionId, fieldPath, next)}
        accessToken={accessToken}
      />
    );
  }
  if (field.type === 'link') {
    const value = (getValueFromDraft(draft, fieldPath) as Record<string, string>) ?? {};
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {field.fields.map((linkField) => (
          <div key={linkField.name}>
            <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">{linkField.label}</label>
            <input
              className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
              value={value[linkField.name] ?? ''}
              onChange={(e) => onChange(sectionId, [...fieldPath, linkField.name], e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  }
  if (field.type === 'repeatable') {
    const items = (getValueFromDraft(draft, fieldPath) as Record<string, unknown>[]) ?? [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wide text-[#6B4E3D]/70">{field.label}</label>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-[#CAB9A7] px-3 py-1 text-xs text-[#6B4E3D]"
            onClick={() => {
              const newItem = createDefaultItem(field.itemFields);
              const nextItems = [...items, newItem];
              onChange(sectionId, fieldPath, nextItems);
            }}
          >
            <Plus size={12} />
            Add
          </button>
        </div>
        {items.length === 0 && <p className="text-xs text-[#6B4E3D]/70">No entries yet.</p>}
        <div className="space-y-4">
          {items.map((_, index) => (
            <div key={index} className="rounded-xl border border-[#E7DED1] bg-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#2F1E1A]">Item {index + 1}</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-xs text-red-700"
                  onClick={() => {
                    const nextItems = items.filter((__, i) => i !== index);
                    onChange(sectionId, fieldPath, nextItems);
                  }}
                >
                  <Trash size={12} />
                  Remove
                </button>
              </div>
              {field.itemFields.map((childField) => (
                <SectionFieldEditor
                  key={`${childField.name}-${index}`}
                  field={childField}
                  sectionId={sectionId}
                  draft={draft}
                  onChange={onChange}
                  path={[...fieldPath, String(index), childField.name]}
                  accessToken={accessToken}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

function getValueFromDraft(draft: Record<string, unknown>, path: string[]): unknown {
  let current: Record<string, unknown> | unknown[] | undefined = draft;
  for (const segment of path) {
    if (current === undefined || current === null) return undefined;
    const isArray = Array.isArray(current);
    const key = Number.isNaN(Number(segment)) ? segment : Number(segment);
    current = isArray
      ? (current as unknown[])[key as number]
      : (current as Record<string, unknown>)[key as string];
  }
  return current;
}

function setValueInDraft(target: Record<string, unknown>, path: string[], value: unknown) {
  let current: Record<string, unknown> | unknown[] = target;
  path.forEach((segment, idx) => {
    const isArray = Array.isArray(current);
    const key = Number.isNaN(Number(segment)) ? segment : Number(segment);
    if (idx === path.length - 1) {
      if (isArray) {
        (current as unknown[])[key as number] = value;
      } else {
        (current as Record<string, unknown>)[key as string] = value;
      }
    } else {
      const nextSegment = path[idx + 1];
      const nextIsNumber = !Number.isNaN(Number(nextSegment));
      const existing = isArray
        ? (current as unknown[])[key as number]
        : (current as Record<string, unknown>)[key as string];
      if (existing === undefined) {
        const nextValue = nextIsNumber ? [] : {};
        if (isArray) {
          (current as unknown[])[key as number] = nextValue;
        } else {
          (current as Record<string, unknown>)[key as string] = nextValue;
        }
      }
      current = isArray
        ? ((current as unknown[])[key as number] as Record<string, unknown> | unknown[])
        : ((current as Record<string, unknown>)[key as string] as Record<string, unknown> | unknown[]);
    }
  });
}

function createDefaultItem(fields: SectionField[]): Record<string, unknown> {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    if (field.type === 'repeatable') {
      acc[field.name] = [];
    } else if (field.type === 'link') {
      acc[field.name] = field.fields.reduce<Record<string, string>>((linkAcc, linkField) => {
        linkAcc[linkField.name] = '';
        return linkAcc;
      }, {});
    } else {
      acc[field.name] = '';
    }
    return acc;
  }, {});
}

