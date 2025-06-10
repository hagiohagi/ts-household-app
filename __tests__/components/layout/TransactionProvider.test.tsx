import { render, screen, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '@/theme/theme'
import { AppContextProvider } from '@/context/AppContext'
import TransactionProvider from '@/components/layout/TransactionProvider'
import { getDocs } from 'firebase/firestore'
import userEvent from '@testing-library/user-event'
import { getServerSideProps } from '@/components/layout/TransactionProvider'

// テスト用の共通コンポーネント
const TestComponent = () => {
  return (
    <div>
      <div data-testid="test-component">TransactionProvider Test</div>
    </div>
  )
}

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <TransactionProvider initialTransactions={[]}>
          {component}
        </TransactionProvider>
      </AppContextProvider>
    </ThemeProvider>
  )
}

describe('TransactionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('初期化のテスト', () => {
    it('コンポーネントが正しくレンダリングされる', () => {
      renderWithProviders(<TestComponent />)
      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('初期トランザクションが正しく設定される', async () => {
      const initialTransactions = [
        {
          id: '1',
          type: 'expense' as const,
          date: '2024-03-01',
          amount: 1000,
          category: '食費' as const,
          content: 'テスト支出1'
        }
      ]

      render(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <TransactionProvider initialTransactions={initialTransactions}>
              <TestComponent />
            </TransactionProvider>
          </AppContextProvider>
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(getDocs).toHaveBeenCalled()
      })
    })
  })

  describe('データ取得のテスト', () => {
    it('Firestoreからデータを正しく取得する', async () => {
      await act(async () => {
        renderWithProviders(<TestComponent />)
      })

      await waitFor(() => {
        expect(getDocs).toHaveBeenCalled()
      })
    })

    it('Firestoreのエラーを正しく処理する', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(getDocs as jest.Mock).mockRejectedValueOnce(new Error('Firestore error'))

      await act(async () => {
        renderWithProviders(<TestComponent />)
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled()
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('ルーティングのテスト', () => {
    it('パス変更時にデータを再取得する', async () => {
      const { rerender } = renderWithProviders(<TestComponent />)

      await waitFor(() => {
        expect(getDocs).toHaveBeenCalledTimes(1)
      })

      // パスを変更して再レンダリング
      rerender(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <TransactionProvider initialTransactions={[]}>
              <TestComponent />
            </TransactionProvider>
          </AppContextProvider>
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(getDocs).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('エラーハンドリングのテスト', () => {
    it('Firebaseが初期化されていない場合のエラーを処理する', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(getDocs as jest.Mock).mockRejectedValueOnce(new Error('Firebase not initialized'))

      await act(async () => {
        renderWithProviders(<TestComponent />)
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '一般的なエラーは:',
          expect.any(Error)
        )
      })

      consoleErrorSpy.mockRestore()
    })

    it('データ取得失敗時のエラーを処理する', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(getDocs as jest.Mock).mockResolvedValueOnce(null)

      renderWithProviders(<TestComponent />)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'データの取得に失敗しました'
        )
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('SSRのテスト', () => {
    it('getServerSidePropsが正しく動作する', async () => {
      const result = await getServerSideProps({} as any)
      
      expect(result).toEqual({
        props: {
          initialTransactions: expect.arrayContaining([
            expect.objectContaining({
              id: '1',
              type: 'expense',
              date: '2024-03-01',
              amount: 1000,
              category: '食費',
              content: 'テスト支出1'
            }),
            expect.objectContaining({
              id: '2',
              type: 'income',
              date: '2024-03-01',
              amount: 5000,
              category: '給与',
              content: 'テスト収入1'
            })
          ])
        }
      })
    })

    it('Firebaseが初期化されていない場合のエラー処理', async () => {
      ;(getDocs as jest.Mock).mockRejectedValueOnce(new Error('Firebase not initialized'))
      
      const result = await getServerSideProps({} as any)
      
      expect(result).toEqual({
        props: {
          initialTransactions: []
        }
      })
    })
  })
})