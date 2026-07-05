import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseEnabled, storage } from '../lib/firebase.js';

export async function uploadImage(file, folder = 'uploads') {
  if (!firebaseEnabled) throw new Error('Firebase is not configured.');
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}
