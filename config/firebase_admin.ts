import { initializeApp, getApps, cert } from 'firebase-admin/app';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENTEMAIL,
    privateKey: (process.env.NEXT_FIREBASE_PRIVATEKEY as string).replace(/\\n/g, '\n'),
  }),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
