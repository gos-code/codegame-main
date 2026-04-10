// @ts-nocheck
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  type DocumentData
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3T1TyPq5iRNzLU5ATzaem4yZamYWKQhU",
  authDomain: "codegame-75c54.firebaseapp.com",
  projectId: "codegame-75c54",
  storageBucket: "codegame-75c54.firebasestorage.app",
  messagingSenderId: "63875927338",
  appId: "1:63875927338:web:codegame"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type User,
  type DocumentData
};
