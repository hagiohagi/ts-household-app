import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Firebase Admin SDKの環境変数が設定されていません。');
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
};

const apps = getApps();

if (!apps.length) {
  try {
    initializeApp(firebaseAdminConfig);
  } catch (error) {
    console.error('Firebase Admin SDKの初期化に失敗しました:', error);
    throw error;
  }
}

export const adminDb = getFirestore();