import { render, screen, fireEvent } from '@testing-library/react'
import TransactionMenu from '@/components/layout/TransactionMenu'
import { ThemeProvider } from '@mui/material/styles'
import { AppContextProvider } from '@/context/AppContext'
import { Transaction } from '@/types'
import { theme } from '@/theme/theme'
import * as AppContext from '@/context/AppContext'

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

describe('TransactionMenu', () => {
  const mockOnAddTransactionForm = jest.fn()
  const mockOnSelectTransaction = jest.fn()
  const mockOnClose = jest.fn()

  const defaultProps = {
    dailyTransactions: [],
    currentDay: '2024年3月1日',
    onAddTransactionForm: mockOnAddTransactionForm,
    onSelectTransaction: mockOnSelectTransaction,
    open: true,
    onClose: mockOnClose
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 基本機能のテスト
  describe('基本機能', () => {
    it('メニューが正しく表示される', () => {
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
          <TransactionMenu {...defaultProps} />
        </AppContextProvider>
      )
      
      expect(screen.getByText('日時： 2024年3月1日')).toBeInTheDocument()
      expect(screen.getByText('内訳')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '内訳を追加' })).toBeInTheDocument()
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
          <TransactionMenu {...defaultProps} dailyTransactions={mockTransactions} />
        </AppContextProvider>
      )
      
      expect(screen.getByText('テスト支出')).toBeInTheDocument()
      expect(screen.getByText('テスト収入')).toBeInTheDocument()

      // 収入の金額を検証
      const incomeElement = screen.getByText('収入').closest('div')?.querySelector('p:nth-child(2)')
      expect(incomeElement).toHaveTextContent('¥5,000')

      // 支出の金額を検証
      const expenseElement = screen.getByText('支出').closest('div')?.querySelector('p:nth-child(2)')
      expect(expenseElement).toHaveTextContent('¥1,000')

      // 残高の金額を検証
      const balanceElement = screen.getByText('残高').closest('div')?.querySelector('p:nth-child(2)')
      expect(balanceElement).toHaveTextContent('¥4,000')
    })

    it('取引をクリックすると選択される', () => {
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
          <TransactionMenu {...defaultProps} dailyTransactions={mockTransactions} />
        </AppContextProvider>
      )
      
      const transaction = screen.getByText('テスト支出')
      fireEvent.click(transaction)
      
      expect(mockOnSelectTransaction).toHaveBeenCalledWith(mockTransactions[0])
    })

    it('内訳追加ボタンをクリックするとフォームが開く', () => {
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
          <TransactionMenu {...defaultProps} dailyTransactions={mockTransactions} />
        </AppContextProvider>
      )
      
      const addButton = screen.getByRole('button', { name: '内訳を追加' })
      fireEvent.click(addButton)
      
      expect(mockOnAddTransactionForm).toHaveBeenCalled()
    })
  })
}) 