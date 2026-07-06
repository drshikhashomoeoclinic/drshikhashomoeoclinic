import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../lib/firebase.js';

export async function listDocs(collectionName, fallback = []) {
  if (!firebaseEnabled) return fallback;
  const snapshot = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getDocument(collectionName, documentId, fallback = null) {
  if (!firebaseEnabled) return fallback;
  const snapshot = await getDoc(doc(db, collectionName, documentId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : fallback;
}

export async function saveDocument(collectionName, documentId, payload) {
  if (!firebaseEnabled) throw new Error('Firebase is not configured.');
  return setDoc(doc(db, collectionName, documentId), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function createDocument(collectionName, payload) {
  if (!firebaseEnabled) throw new Error('Firebase is not configured.');
  return addDoc(collection(db, collectionName), { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateDocument(collectionName, documentId, payload) {
  if (!firebaseEnabled) throw new Error('Firebase is not configured.');
  return updateDoc(doc(db, collectionName, documentId), { ...payload, updatedAt: serverTimestamp() });
}

export async function removeDocument(collectionName, documentId) {
  if (!firebaseEnabled) throw new Error('Firebase is not configured.');
  return deleteDoc(doc(db, collectionName, documentId));
}
