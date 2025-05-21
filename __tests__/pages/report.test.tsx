import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import { AppContextProvider } from '@/context/AppContext'
import Report from '@/pages/report'
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
  it('正しくレンダリングされる', () => {
    renderWithContext(<Report />)
    
    // ヘッダーの存在確認
    expect(screen.getByText('レポート')).toBeInTheDocument()
    
    // グラフコンポーネントの存在確認
    expect(screen.getByText('収支の種類')).toBeInTheDocument()
  })

  it('収支タイプの切り替えが機能する', async () => {
    renderWithContext(<Report />)
    
    // 収支タイプのセレクトボックスをクリック
    const typeSelect = screen.getByRole('combobox', { name: '収支の種類' })
    await userEvent.click(typeSelect)
    
    // 収入と支出のオプションが存在することを確認
    expect(screen.getByText('収入')).toBeInTheDocument()
    expect(screen.getByText('支出')).toBeInTheDocument()
  })
}) 