import { render, screen } from '@testing-library/react'
import DailySummary from '@/components/layout/DailySummary'
import { ThemeProvider } from '@mui/material/styles'
import { AppContextProvider } from '@/context/AppContext'
import { theme } from '@/theme/theme'
import { Transaction } from '@/types'

// テスト用のラッパーコンポーネント
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  )
}

describe('DailySummary', () => {
  // 基本機能のテスト
  describe('基本機能', () => {
    it('収支の合計が正しく表示される', () => {
      renderWithTheme(
        <AppContextProvider>
          <DailySummary dailyTransactions={[]} columns={3} />
        </AppContextProvider>
      )
      
      expect(screen.getByText('収入')).toBeInTheDocument()
      expect(screen.getByText('支出')).toBeInTheDocument()
      expect(screen.getByText('残高')).toBeInTheDocument()
    })
  })

  // 取引表示のテスト
  describe('取引表示', () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        date: '2024-03-01',
        amount: 1000,
        category: '食費',
        content: 'テスト支出'
      },
      {
        id: '2',
        type: 'income',
        date: '2024-03-01',
        amount: 5000,
        category: '給与',
        content: 'テスト収入'
      }
    ]

    it('取引が正しく表示される', () => {
      renderWithTheme(
        <AppContextProvider>
          <DailySummary dailyTransactions={mockTransactions} columns={3} />
        </AppContextProvider>
      )
      
      // 収入の金額を検証
      const incomeCard = screen.getByText('収入').closest('div')
      const incomeAmount = incomeCard?.querySelector('p:nth-child(2)')
      expect(incomeAmount).toHaveTextContent('¥5,000')

      // 支出の金額を検証
      const expenseCard = screen.getByText('支出').closest('div')
      const expenseAmount = expenseCard?.querySelector('p:nth-child(2)')
      expect(expenseAmount).toHaveTextContent('¥1,000')

      // 残高の金額を検証
      const balanceCard = screen.getByText('残高').closest('div')
      const balanceAmount = balanceCard?.querySelector('p:nth-child(2)')
      expect(balanceAmount).toHaveTextContent('¥4,000')
    })
  })
}) 