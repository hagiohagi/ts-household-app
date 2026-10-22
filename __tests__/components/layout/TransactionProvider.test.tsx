import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import TransactionProvider from '@/components/layout/TransactionProvider'
import { getDocs } from 'firebase/firestore'

// Contextの状態を表示するテスト用コンポーネント
const TestComponent = () => {
  const { transactions, isLoading } = useAppContext()
  return (
    <div>
      <div data-testid="test-component">TransactionProvider Test</div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'loaded'}</div>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>{t.content}</li>
        ))}
      </ul>
    </div>
  )
}

const providers = (
  <ThemeProvider theme={theme}>
    <AppContextProvider>
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    </AppContextProvider>
  </ThemeProvider>
)

describe('TransactionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('子コンポーネントが正しくレンダリングされる', async () => {
    render(providers)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded'))
  })

  it('Firestoreから取得したデータをContextに設定する', async () => {
    render(providers)

    expect(await screen.findByText('テスト支出1')).toBeInTheDocument()
    expect(screen.getByText('テスト収入1')).toBeInTheDocument()
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded')
    expect(getDocs).toHaveBeenCalledTimes(1)
  })

  it('再レンダリングしてもデータを再取得しない', async () => {
    const { rerender } = render(providers)
    await screen.findByText('テスト支出1')

    rerender(providers)

    await waitFor(() => expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded'))
    expect(getDocs).toHaveBeenCalledTimes(1)
  })

  it('FireStoreのエラーを処理し、ローディングを終了する', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(getDocs as jest.Mock).mockRejectedValueOnce({ code: 'permission-denied', message: 'denied' })

    render(providers)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('FireStoreのエラーは:', expect.objectContaining({ code: 'permission-denied' }))
    })
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('一般的なエラーを処理する', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(getDocs as jest.Mock).mockRejectedValueOnce(new Error('network error'))

    render(providers)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('一般的なエラーは:', expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })
})
