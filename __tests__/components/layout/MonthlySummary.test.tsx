import { render, screen } from '@testing-library/react'
import MonthlySummary from '@/components/layout/MonthlySummary'
import { ThemeProvider } from '@mui/material/styles'
import { AppContextProvider } from '@/context/AppContext'
import { theme } from '@/theme/theme'
import { Transaction } from '@/types'
import * as AppContext from '@/context/AppContext'
import { financeCalculations } from '@/utils/financeCalculation'

// useAppContextのモック
jest.mock('@/context/AppContext', () => ({
  ...jest.requireActual('@/context/AppContext'),
  useAppContext: jest.fn()
}))

// テスト用のラッパーコンポーネント
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  )
}

describe('MonthlySummary', () => {
  // 基本機能のテスト
  describe('基本機能', () => {
    it('収支の合計が正しく表示される', () => {
      (AppContext.useAppContext as jest.Mock).mockReturnValue({
        isMobile: false,
        transactions: [],
        setTransactions: jest.fn(),
        currentMonth: new Date('2024-03-01'),
        setCurrentMonth: jest.fn(),
        isLoading: false,
        setIsLoading: jest.fn(),
        onSaveTransaction: jest.fn(),
        onDeleteTransaction: jest.fn(),
        onUpdateTransaction: jest.fn()
      })

      renderWithTheme(
        <AppContextProvider>
          <MonthlySummary />
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
        content: 'テスト支出1'
      },
      {
        id: '2',
        type: 'expense',
        date: '2024-03-02',
        amount: 2000,
        category: '交通費',
        content: 'テスト支出2'
      },
      {
        id: '3',
        type: 'income',
        date: '2024-03-01',
        amount: 5000,
        category: '給与',
        content: 'テスト収入'
      }
    ]

    it('月間の取引が正しく集計される', () => {
      (AppContext.useAppContext as jest.Mock).mockReturnValue({
        isMobile: false,
        transactions: mockTransactions,
        setTransactions: jest.fn(),
        currentMonth: new Date('2024-03-01'),
        setCurrentMonth: jest.fn(),
        isLoading: false,
        setIsLoading: jest.fn(),
        onSaveTransaction: jest.fn(),
        onDeleteTransaction: jest.fn(),
        onUpdateTransaction: jest.fn()
      })

      renderWithTheme(
        <AppContextProvider>
          <MonthlySummary />
        </AppContextProvider>
      )
      
      // financeCalculationsの結果を検証
      const { income, expense, balance } = financeCalculations(mockTransactions)
      expect(income).toBe(5000)
      expect(expense).toBe(3000)
      expect(balance).toBe(2000)
    })
  })
}) 