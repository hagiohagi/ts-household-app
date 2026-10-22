import '@testing-library/jest-dom'

// Mock for next/navigation (App Router)
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock for Firebase
jest.mock('firebase/app', () => ({
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
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
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
    doc: jest.fn(),
  })),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: [
      {
        id: '1',
        data: () => ({
          type: 'expense',
          date: '2024-03-01',
          amount: 1000,
          category: '食費',
          content: 'テスト支出1'
        })
      },
      {
        id: '2',
        data: () => ({
          type: 'income',
          date: '2024-03-01',
          amount: 5000,
          category: '給与',
          content: 'テスト収入1'
        })
      }
    ]
  })),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}))

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}))

// Material-UIのモック
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
}))

// スタイルのモック
jest.mock('@/styles/index.css', () => ({}))
jest.mock('@/styles/calendar.css', () => ({}))
