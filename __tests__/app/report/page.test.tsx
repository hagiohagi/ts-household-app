import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import { AppContextProvider } from '@/context/AppContext'
import ReportPage from '@/app/report/page'
import userEvent from '@testing-library/user-event'

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        {component}
      </AppContextProvider>
    </ThemeProvider>
  )
}

describe('Report Page', () => {
  it('正しくレンダリングされる', async () => {
    renderWithContext(<ReportPage />)

    await waitFor(() => {
      // グラフコンポーネントの存在確認
      expect(screen.getByLabelText('収支の種類')).toBeInTheDocument()
      // 取引テーブルの存在確認
      expect(screen.getByText('月の収支')).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 15000)

  it('収支タイプの切り替えが機能する', async () => {
    renderWithContext(<ReportPage />)

    // 初期レンダリングの完了を待機
    await waitFor(() => {
      expect(screen.getByLabelText('収支の種類')).toBeInTheDocument()
    }, { timeout: 10000 })

    // 収支タイプのセレクトボックスをクリック
    const typeSelect = screen.getByRole('combobox', { name: '収支の種類' })
    await userEvent.click(typeSelect)

    // 収入と支出のオプションが存在することを確認
    await waitFor(() => {
      expect(screen.getByRole('option', { name: '収入' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: '支出' })).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 15000)
})
