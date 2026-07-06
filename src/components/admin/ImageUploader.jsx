import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { uploadImage } from '../../services/storage.js';

export default function ImageUploader({ onUploaded, folder = 'uploads' }) {
  const [status, setStatus] = useState('');

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setStatus('Please choose an image file.');
    if (file.size > 2_500_000) return setStatus('Please upload an optimized image below 2.5 MB.');
    try {
      setStatus('Uploading...');
      const url = await uploadImage(file, folder);
      onUploaded(url);
      setStatus('Image uploaded.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
      <UploadCloud className="text-clinic-emerald" />
      Drag and drop ready image upload
      <input className="sr-only" type="file" accept="image/*" onChange={handleFile} />
      {status && <span className="text-xs text-clinic-emerald">{status}</span>}
    </label>
  );
}
