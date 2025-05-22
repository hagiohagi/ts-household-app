import { render, screen, waitFor } from '@testing-library/react'
import App from '@/pages/_app'
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@mui/material'
import userEvent from '@testing-library/user-event'

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

describe('_app.tsx', () => {
  it('グローバルスタイルが適用される', async () => {
    render(
      <App
        Component={() => <div>テストコンポーネント</div>}
        pageProps={{}}
        router={{} as any}
      />
    )

    // グローバルスタイルの適用を待機
    await waitFor(() => {
      const body = document.body
      expect(body.style.margin).toBe('0px')
      expect(body.style.fontFamily).toBe('-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif')
      expect(body.style.getPropertyValue('webkit-font-smoothing')).toBe('antialiased')
    }, { timeout: 15000 })
  }, 20000)

  it('AppContextProviderが正しく機能する', async () => {
    render(
      <App
        Component={AppContextTestComponent}
        pageProps={{}}
        router={{} as any}
      />
    )

    // 初期状態の確認
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')

    // トグルボタンのクリック
    const toggleButton = screen.getByRole('button', { name: 'Toggle Loading' })
    await userEvent.click(toggleButton)

    // 状態が変更されたことを確認
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded')
  })

  it('ThemeProviderが正しく機能する', async () => {
    render(
      <App
        Component={ThemeTestComponent}
        pageProps={{}}
        router={{} as any}
      />
    )

    // テーマの値が正しく適用されていることを確認
    expect(screen.getByTestId('income-color')).toHaveTextContent('#2196f3')
    expect(screen.getByTestId('expense-color')).toHaveTextContent('#f44336')
  })
}) 