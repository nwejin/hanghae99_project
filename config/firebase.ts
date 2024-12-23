import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, set } from 'firebase/database'; // Realtime Database
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Cloud Firestore

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// next.js가 어플리케이션을 리로드할때 실수로 SDK를 다시 초기화 하는걸 방지한다.
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);
export const database = getDatabase(app); // Realtime Database
export const firestore = getFirestore(app); // Cloud Firestore
export const auth = getAuth(app);
