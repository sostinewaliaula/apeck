import { FormEvent, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';
import { deleteMediaAsset, fetchMediaAssets, MediaAsset, uploadMediaAsset } from '../api';
import { resolveMediaUrl } from '../../lib/media';

const VIDEO_EXT_REGEX = /\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i;

function isVideoAsset(asset: MediaAsset) {
  if (!asset) return false;
  if (asset.mime_type?.startsWith('video/')) return true;
  return asset.url ? VIDEO_EXT_REGEX.test(asset.url.toLowerCase()) : false;
}

export function AdminMediaLibrary() {
  const { accessToken } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchMediaAssets(accessToken);
        setAssets(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken]);

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken || !file) return;
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(accessToken, file, altText);
      setAssets((prev) => [asset, ...prev]);
      setFile(null);
      setAltText('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    const confirmed = window.confirm('Delete this asset?');
    if (!confirmed) return;
    try {
      await deleteMediaAsset(accessToken, id);
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset');
    }
  };

  return (
    <AdminLayout
      title="Media library"
      description="Upload new assets or reuse existing images across sections."
    >
      <div className="space-y-6">
        <form className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-5 space-y-4" onSubmit={handleUpload}>
          <p className="text-sm uppercase tracking-wide text-[#B15C5C]">Upload media</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                Choose file
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-[#6B4E3D]"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                Alt text (optional)
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this image"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading || !file}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B2332] px-4 py-2 text-sm font-semibold text-white hover:bg-[#761c29] disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="rounded-2xl border border-[#F0E7DA] bg-white/90 p-5">
          <p className="text-sm uppercase tracking-wide text-[#B15C5C] mb-4">Assets</p>
          {isLoading ? (
            <p className="text-sm text-[#6B4E3D]">Loading media…</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-[#6B4E3D]">No media uploaded yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-2xl border border-[#E7DED1] bg-white overflow-hidden shadow-sm">
                  <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                    {isVideoAsset(asset) ? (
                      <video
                        src={resolveMediaUrl(asset.url)}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={resolveMediaUrl(asset.url)}
                        alt={asset.alt_text ?? ''}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <button
                      type="button"
                      className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-red-600 hover:bg-white"
                      onClick={() => handleDelete(asset.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-[#2F1E1A] truncate">{asset.file_name}</p>
                    <p className="text-[11px] text-[#6B4E3D]/80 truncate">{asset.alt_text || 'No alt text'}</p>
                    <p className="text-[11px] text-[#6B4E3D]/60 break-all mt-1">{asset.url}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

