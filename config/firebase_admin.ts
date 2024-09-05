import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENTEMAIL,
    privateKey: (process.env.NEXT_FIREBASE_PRIVATEKEY as string).replace(/\\n/g, '\n'),
  }),
};

// 초기화
export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}

// if (!getApps().length) {
//   initializeApp(firebaseAdminConfig);
// }

customInitApp();
export const auth = getAuth();
export const db = getFirestore();
