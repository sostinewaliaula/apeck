import { FormEvent, useEffect, useMemo, useState } from 'react';

import {
  fetchMediaAssets,
  MediaAsset,
  uploadMediaAsset,
} from '../api';
import { resolveMediaUrl } from '../../lib/media';

const VIDEO_EXT_REGEX = /\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i;

function isVideoUrl(url?: string | null) {
  if (!url) return false;
  return VIDEO_EXT_REGEX.test(url.toLowerCase());
}

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accessToken?: string | null;
};

export function ImageFieldEditor({
  label,
  value,
  onChange,
  accessToken,
}: ImageFieldProps) {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const isVideo = useMemo(() => isVideoUrl(value), [value]);

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
        <button
          type="button"
          className="rounded-xl border border-[#CAB9A7] px-3 py-2 text-xs font-semibold text-[#6B4E3D]"
          onClick={() => setPickerOpen(true)}
          disabled={!accessToken}
        >
          Select
        </button>
      </div>
      {value && (
        <div className="mt-2">
          {isVideo ? (
            <video
              src={resolveMediaUrl(value)}
              controls
              muted
              playsInline
              className="w-full max-w-xs rounded-xl border border-[#E7DED1]"
            />
          ) : (
            <img
              src={resolveMediaUrl(value)}
              alt=""
              className="w-full max-w-xs rounded-xl border border-[#E7DED1]"
            />
          )}
        </div>
      )}
      {isPickerOpen && accessToken && (
        <MediaPickerModal
          accessToken={accessToken}
          onSelect={(asset) => {
            onChange(asset.url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

type MediaPickerModalProps = {
  accessToken: string;
  onSelect: (asset: MediaAsset) => void;
  onClose: () => void;
};

function MediaPickerModal({
  accessToken,
  onSelect,
  onClose,
}: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchMediaAssets(accessToken);
        setAssets(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load media',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken]);

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(accessToken, file, altText);
      setAssets((prev) => [asset, ...prev]);
      setFile(null);
      setAltText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E7DED1] px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-[#2F1E1A]">
              Select media
            </p>
            <p className="text-xs text-[#6B4E3D]/70">
              Pick an existing image or video, or upload a new asset.
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-[#6B4E3D] hover:text-[#8B2332]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form
            className="grid gap-4 md:grid-cols-[2fr,1fr]"
            onSubmit={handleUpload}
          >
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                Upload media
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-[#6B4E3D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#6B4E3D]/70">
                Alt text
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={uploading || !file}
                className="inline-flex items-center gap-2 rounded-xl bg-[#8B2332] px-4 py-2 text-sm font-semibold text-white hover:bg-[#761c29] disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
          </form>
          <div>
              <p className="text-sm font-semibold text-[#2F1E1A] mb-3">
                Library
              </p>
            {isLoading ? (
              <p className="text-sm text-[#6B4E3D]">Loading media…</p>
            ) : assets.length === 0 ? (
              <p className="text-sm text-[#6B4E3D]">No media uploaded yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {assets.map((asset) => (
                  <button
                    type="button"
                    key={asset.id}
                    className="text-left rounded-2xl border border-[#E7DED1] bg-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    onClick={() => onSelect(asset)}
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      {asset.mime_type?.startsWith('video/') || isVideoUrl(asset.url) ? (
                        <video
                          src={resolveMediaUrl(asset.url)}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={resolveMediaUrl(asset.url)}
                          alt={asset.alt_text ?? ''}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-[#2F1E1A] truncate">
                        {asset.file_name}
                      </p>
                      <p className="text-[11px] text-[#6B4E3D]/80 truncate">
                        {asset.alt_text || 'No alt text'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


