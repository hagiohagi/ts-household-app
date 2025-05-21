import '@testing-library/jest-dom'

// Mock for next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

// Mock for Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    projectId: 'test-project',
    appId: 'test-app-id',
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain',
    storageBucket: 'test-storage-bucket',
    messagingSenderId: 'test-messaging-sender-id',
  })),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}))

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
})) 