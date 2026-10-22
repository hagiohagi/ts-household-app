import { render, screen } from '@testing-library/react'
import Providers from '@/app/providers'
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@mui/material'
import userEvent from '@testing-library/user-event'

// TransactionProviderのモック
jest.mock('@/components/layout/TransactionProvider', () => {
  return function MockTransactionProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

// AppContextProviderのテスト用モックコンポーネント
const AppContextTestComponent = () => {
  const { isLoading, setIsLoading } = useAppContext()
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'loaded'}</div>
      <button onClick={() => setIsLoading(!isLoading)}>Toggle Loading</button>
    </div>
  )
}

// ThemeProviderのテスト用モックコンポーネント
const ThemeTestComponent = () => {
  const theme = useTheme()
  return (
    <div>
      <div data-testid="income-color">{theme.palette.incomeColor.main}</div>
      <div data-testid="expense-color">{theme.palette.expenseColor.main}</div>
    </div>
  )
}

describe('Providers', () => {
  it('AppContextProviderが正しく機能する', async () => {
    render(
      <Providers>
        <AppContextTestComponent />
      </Providers>
    )

    // 初期状態の確認
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')

    // トグルボタンのクリック
    await userEvent.click(screen.getByRole('button', { name: 'Toggle Loading' }))

    // 状態が変更されたことを確認
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded')
  })

  it('ThemeProviderが正しく機能する', () => {
    render(
      <Providers>
        <ThemeTestComponent />
      </Providers>
    )

    // テーマの値が正しく適用されていることを確認
    expect(screen.getByTestId('income-color')).toHaveTextContent('#2196f3')
    expect(screen.getByTestId('expense-color')).toHaveTextContent('#f44336')
  })
})
