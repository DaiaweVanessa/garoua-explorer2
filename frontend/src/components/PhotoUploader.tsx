import { useState } from 'react';
import { api } from '@/services/api';
import { uploadImageToCloudinary } from '@/services/cloudinary';

interface Photo {
  id: number;
  url: string;
  position: number;
}

interface PhotoUploaderProps {
  placeId: number;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
}

export function PhotoUploader({ placeId, photos, onPhotosChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      const res = await api.post(`/places/${placeId}/photos`, { url, position: photos.length });
      const updatedPhotos = res.data.data.photos as Photo[];
      onPhotosChange(updatedPhotos);
    } catch {
      setError("Échec de l'upload. Vérifie ta connexion et réessaie.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(photoId: number) {
    try {
      await api.delete(`/photos/${photoId}`);
      onPhotosChange(photos.filter((p) => p.id !== photoId));
    } catch {
      setError('Impossible de supprimer cette photo.');
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-indigo/25 p-5">
      <p className="font-sans text-sm font-semibold text-indigo">Photos du lieu</p>

      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative h-20 w-20 overflow-hidden rounded-lg">
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute inset-0 flex items-center justify-center bg-indigo/70 text-sable opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Supprimer cette photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-indigo/20 px-4 py-2 font-sans text-sm font-semibold text-indigo transition-colors hover:border-laterite hover:text-laterite">
        {uploading ? 'Envoi en cours...' : '+ Ajouter une photo'}
        <input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} className="hidden" />
      </label>

      {error && <p className="mt-2 font-sans text-xs text-laterite">{error}</p>}
    </div>
  );
}