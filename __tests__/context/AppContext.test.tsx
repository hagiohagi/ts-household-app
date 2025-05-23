import { render, screen, waitFor } from '@testing-library/react'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import { addDoc,  deleteDoc, updateDoc } from 'firebase/firestore'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/theme/theme'
import userEvent from '@testing-library/user-event'

// テスト用の共通コンポーネント
const TestComponent = () => {
  const context = useAppContext()
  return (
    <div>
      <div data-testid="transactions-count">{context.transactions.length}</div>
      <div data-testid="current-month">{context.currentMonth.toISOString()}</div>
      <div data-testid="is-loading">{String(context.isLoading)}</div>
      <div data-testid="is-mobile">{String(context.isMobile)}</div>
      <button onClick={() => context.setIsLoading(!context.isLoading)}>Toggle Loading</button>
      <button onClick={() => context.setCurrentMonth(new Date('2024-01-01'))}>Set January</button>
    </div>
  )
}

// トランザクション操作用のテストコンポーネント
const TransactionTestComponent = ({ onAction }: { onAction: (context: ReturnType<typeof useAppContext>) => void }) => {
  const context = useAppContext()
  return (
    <div>
      <div data-testid="transactions-count">{context.transactions.length}</div>
      <button onClick={() => onAction(context)}>Execute Action</button>
    </div>
  )
}

// コンテキストなしのテスト用コンポーネント
const NoContextComponent = () => {
  try {
    useAppContext()
    return <div>Context exists</div>
  } catch (error) {
    return <div>No context</div>
  }
}

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        {component}
      </AppContextProvider>
    </ThemeProvider>
  )
}

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('初期状態のテスト', () => {
    it('初期値が正しく設定されている', () => {
      renderWithContext(<TestComponent />)
      
      expect(screen.getByTestId('transactions-count')).toHaveTextContent('0')
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true')
      expect(screen.getByTestId('is-mobile')).toHaveTextContent('false')
    })
  })

  describe('トランザクション操作のテスト', () => {
    it('トランザクションが正しく保存される', async () => {
      const mockDocRef = { id: 'test-id' }
      ;(addDoc as jest.Mock).mockResolvedValue(mockDocRef)
      
      renderWithContext(
        <TransactionTestComponent
          onAction={(context) => context.onSaveTransaction({
            amount: 1000,
            content: 'テスト',
            type: 'income',
            category: '給与',
            date: '2024-01-01'
          })}
        />
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('0')
      })

      const actionButton = screen.getByRole('button', { name: 'Execute Action' })
      await userEvent.click(actionButton)

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('1')
      })
    })

    it('トランザクションが正しく削除される', async () => {
      const mockDocRef = { id: 'test-id' }
      ;(addDoc as jest.Mock).mockResolvedValue(mockDocRef)
      ;(deleteDoc as jest.Mock).mockResolvedValue(undefined)
      
      renderWithContext(
        <TransactionTestComponent
          onAction={(context) => {
            context.onSaveTransaction({
              amount: 1000,
              content: 'テスト',
              type: 'income',
              category: '給与',
              date: '2024-01-01'
            })
            context.onDeleteTransaction('test-id')
          }}
        />
      )
      
      const actionButton = screen.getByRole('button', { name: 'Execute Action' })
      await userEvent.click(actionButton)

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('0')
      })
    })

    it('複数のトランザクションが正しく削除される', async () => {
      const mockDocRef1 = { id: 'test-id-1' }
      const mockDocRef2 = { id: 'test-id-2' }
      ;(addDoc as jest.Mock)
        .mockResolvedValueOnce(mockDocRef1)
        .mockResolvedValueOnce(mockDocRef2)
      ;(deleteDoc as jest.Mock).mockResolvedValue(undefined)
      
      const TestComponent = () => {
        const { transactions, onSaveTransaction, onDeleteTransaction } = useAppContext()
    
        return (
          <div>
            <div data-testid="transactions-count">{transactions.length}</div>
            <button onClick={() => onSaveTransaction({
              amount: 1000,
              content: 'テスト1',
              type: 'income',
              category: '給与',
              date: '2024-01-01'
            })}>
              Save Transaction 1
            </button>
            <button onClick={() => onSaveTransaction({
              amount: 2000,
              content: 'テスト2',
              type: 'income',
              category: '給与',
              date: '2024-01-01'
            })}>
              Save Transaction 2
            </button>
            <button onClick={() => onDeleteTransaction(['test-id-1', 'test-id-2'])}>Delete All</button>
          </div>
        )
      }
      
      renderWithContext(<TestComponent />)
      
      const saveButton1 = screen.getByRole('button', { name: 'Save Transaction 1' })
      const saveButton2 = screen.getByRole('button', { name: 'Save Transaction 2' })
      const deleteButton = screen.getByRole('button', { name: 'Delete All' })

      await userEvent.click(saveButton1)
      await userEvent.click(saveButton2)

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('2')
      })

      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('0')
      })
    })

    it('トランザクションが正しく更新される', async () => {
      const mockDocRef = { id: 'test-id' }
      ;(addDoc as jest.Mock).mockResolvedValue(mockDocRef)
      ;(updateDoc as jest.Mock).mockResolvedValue(undefined)
      
      const TestComponentWithUpdate = () => {
        const context = useAppContext()
        return (
          <div>
            <div data-testid="transactions-count">{context.transactions.length}</div>
            <button onClick={() => context.onSaveTransaction({
              amount: 1000,
              content: 'テスト',
              type: 'income',
              category: '給与',
              date: '2024-01-01'
            })}>Save Transaction</button>
            <button onClick={() => context.onUpdateTransaction({
              amount: 2000,
              content: '更新テスト',
              type: 'income',
              category: '給与',
              date: '2024-01-01'
            }, 'test-id')}>Update Transaction</button>
          </div>
        )
      }
      
      renderWithContext(<TestComponentWithUpdate />)
      
      const saveButton = screen.getByRole('button', { name: 'Save Transaction' })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('1')
      })

      const updateButton = screen.getByRole('button', { name: 'Update Transaction' })
      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('1')
      })
    })
  })

  describe('状態更新関数のテスト', () => {
    it('setIsLoadingが正しく動作する', async () => {
      renderWithContext(<TestComponent />)
      
      const toggleButton = screen.getByRole('button', { name: 'Toggle Loading' })
      await userEvent.click(toggleButton)
      
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    it('setCurrentMonthが正しく動作する', async () => {
      renderWithContext(<TestComponent />)
      
      const setJanuaryButton = screen.getByRole('button', { name: 'Set January' })
      await userEvent.click(setJanuaryButton)
      
      expect(screen.getByTestId('current-month')).toHaveTextContent('2024-01-01')
    })
  })

  describe('カスタムフックのテスト', () => {
    it('コンテキストが存在しない場合にエラーを投げる', () => {
      render(<NoContextComponent />)
      expect(screen.getByText('No context')).toBeInTheDocument()
    })
  })

  describe('エラーハンドリングのテスト', () => {
    it('一般的なエラーが正しく処理される', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const generalError = new Error('General error')
      ;(addDoc as jest.Mock).mockRejectedValue(generalError)
      
      renderWithContext(
        <TransactionTestComponent
          onAction={(context) => context.onSaveTransaction({
            amount: 1000,
            content: 'テスト',
            type: 'income',
            category: '給与',
            date: '2024-01-01'
          })}
        />
      )
      
      const actionButton = screen.getByRole('button', { name: 'Execute Action' })
      await userEvent.click(actionButton)

      expect(consoleErrorSpy).toHaveBeenCalledWith('一般的なエラーは:', generalError)
      consoleErrorSpy.mockRestore()
    })

    it('トランザクション追加時のFireStoreエラーが正しく処理される', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const fireStoreError = {
        code: 'permission-denied',
        message: 'Firestore error',
        name: 'FirebaseError'
      }
      ;(addDoc as jest.Mock).mockRejectedValue(fireStoreError)
      
      renderWithContext(
        <TransactionTestComponent
          onAction={(context) => context.onSaveTransaction({
            amount: 1000,
            content: 'テスト',
            type: 'income',
            category: '給与',
            date: '2024-01-01'
          })}
        />
      )
      
      const actionButton = screen.getByRole('button', { name: 'Execute Action' })
      await userEvent.click(actionButton)

      expect(consoleErrorSpy).toHaveBeenCalledWith('FireStoreのエラーは:', fireStoreError)
      consoleErrorSpy.mockRestore()
    })

    it('トランザクション削除時のFireStoreエラーが正しく処理される', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const fireStoreError = {
        code: 'permission-denied',
        message: 'Firestore error',
        name: 'FirebaseError'
      }
      ;(deleteDoc as jest.Mock).mockRejectedValue(fireStoreError)
      
      renderWithContext(
        <TransactionTestComponent
          onAction={(context) => context.onDeleteTransaction('test-id')}
        />
      )
      
      const actionButton = screen.getByRole('button', { name: 'Execute Action' })
      await userEvent.click(actionButton)

      expect(consoleErrorSpy).toHaveBeenCalledWith('FireStoreのエラーは:', fireStoreError)
      consoleErrorSpy.mockRestore()
    })

    it('トランザクション更新時のFireStoreエラーが正しく処理される', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const fireStoreError = {
        code: 'permission-denied',
        message: 'Firestore error',
        name: 'FirebaseError'
      }
      ;(updateDoc as jest.Mock).mockRejectedValue(fireStoreError)
      
      renderWithContext(
        <TransactionTestComponent
          onAction={(context) => context.onUpdateTransaction({
            amount: 2000,
            content: '更新テスト',
            type: 'income',
            category: '給与',
            date: '2024-01-01'
          }, 'test-id')}
        />
      )
      
      const actionButton = screen.getByRole('button', { name: 'Execute Action' })
      await userEvent.click(actionButton)

      expect(consoleErrorSpy).toHaveBeenCalledWith('FireStoreのエラーは:', fireStoreError)
      consoleErrorSpy.mockRestore()
    })
  })

  describe('レスポンシブ対応のテスト', () => {
    it('isMobileが画面サイズに応じて更新される', () => {
      const useMediaQueryMock = jest.requireMock('@mui/material').useMediaQuery
      useMediaQueryMock.mockReturnValue(true)
      
      renderWithContext(<TestComponent />)
      expect(screen.getByTestId('is-mobile')).toHaveTextContent('true')
    })
  })
}) 