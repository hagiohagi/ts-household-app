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

// スタイルのモック
jest.mock('@/styles/index.css', () => ({}))
jest.mock('@/styles/calendar.css', () => ({}))
jest.mock('@/styles/App.css', () => ({}))

// グローバルスタイルの設定
beforeEach(() => {
  document.body.style.margin = '0'
  document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
  document.body.style.webkitFontSmoothing = 'antialiased'
  document.body.style.mozOsxFontSmoothing = 'grayscale'
}) 