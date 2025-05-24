import { render, screen, fireEvent } from '@testing-library/react'
import TransactionForm from '@/components/layout/TransactionForm'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AppContext } from '@/context/AppContext'
import { Transaction } from '@/types'
import { theme } from '@/theme/theme' 

// テスト用のラッパーコンポーネント
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  )
}

describe('TransactionForm', () => {
  const mockOnCloseForm = jest.fn()
  const mockSetSelectedTransaction = jest.fn()
  const mockSetIsDialogOpen = jest.fn()
  const mockOnSaveTransaction = jest.fn()
  const mockOnUpdateTransaction = jest.fn()
  const mockOnDeleteTransaction = jest.fn()
  const mockSetTransactions = jest.fn()
  const mockSetCurrentMonth = jest.fn()

  const defaultProps = {
    onCloseForm: mockOnCloseForm,
    isEntryDrawerOpen: true,
    currentDay: '2024-03-01',
    selectedTransaction: null,
    setSelectedTransaction: mockSetSelectedTransaction,
    isDialogOpen: false,
    setIsDialogOpen: mockSetIsDialogOpen
  }

  const mockContextValue = {
    isMobile: false,
    onSaveTransaction: mockOnSaveTransaction,
    onUpdateTransaction: mockOnUpdateTransaction,
    onDeleteTransaction: mockOnDeleteTransaction,
    transactions: [],
    setTransactions: mockSetTransactions,
    currentMonth: new Date(),
    setCurrentMonth: mockSetCurrentMonth,
    isLoading: false,
    setIsLoading: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 基本機能のテスト
  describe('基本機能', () => {
    it('フォームが正しく表示される', () => {
      renderWithTheme(
        <AppContext.Provider value={mockContextValue}>
          <TransactionForm {...defaultProps} />
        </AppContext.Provider>
      )
      
      expect(screen.getByText('入力')).toBeInTheDocument()
      expect(screen.getByText('支出')).toBeInTheDocument()
      expect(screen.getByText('収入')).toBeInTheDocument()
    })

    it('初期値が正しく設定される', () => {
      renderWithTheme(
        <AppContext.Provider value={mockContextValue}>
          <TransactionForm {...defaultProps} />
        </AppContext.Provider>
      )
      
      const dateInput = screen.getByLabelText('日付')
      expect(dateInput).toHaveValue('2024-03-01')
    })
  })

  // フォーム操作のテスト
  describe('フォーム操作', () => {
    it('収支タイプを切り替えることができる', () => {
      renderWithTheme(
        <AppContext.Provider value={mockContextValue}>
          <TransactionForm {...defaultProps} />
        </AppContext.Provider>
      )
      
      const incomeButton = screen.getByText('収入')
      fireEvent.click(incomeButton)
      
      expect(incomeButton).toHaveClass('MuiButton-contained')
    })

    it('閉じるボタンをクリックするとonCloseFormが呼ばれる', () => {
      renderWithTheme(
        <AppContext.Provider value={mockContextValue}>
          <TransactionForm {...defaultProps} />
        </AppContext.Provider>
      )
      
      const closeButton = screen.getByRole('button', { name: '' })
      fireEvent.click(closeButton)
      
      expect(mockOnCloseForm).toHaveBeenCalled()
    })
  })

  // 取引編集のテスト
  describe('取引編集', () => {
    const selectedTransaction: Transaction = {
      id: '1',
      type: 'expense',
      date: '2024-03-01',
      amount: 1000,
      category: '食費',
      content: 'テスト支出'
    }

    it('選択された取引の値がフォームに設定される', () => {
      renderWithTheme(
        <AppContext.Provider value={mockContextValue}>
          <TransactionForm {...defaultProps} selectedTransaction={selectedTransaction} />
        </AppContext.Provider>
      )
      
      const amountInput = screen.getByLabelText('金額')
      expect(amountInput).toHaveValue(1000)

      const contentInput = screen.getByLabelText('内容')
      expect(contentInput).toHaveValue('テスト支出')
    })
  })
}) 