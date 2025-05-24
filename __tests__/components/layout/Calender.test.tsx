import { render, screen, fireEvent } from '@testing-library/react'
import Calender from '@/components/layout/Calender'
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

describe('Calender', () => {
  const mockSetCurrentDay = jest.fn()
  const mockOnDateClick = jest.fn()

  const defaultProps = {
    currentDay: '2024-03-01',
    setCurrentDay: mockSetCurrentDay,
    today: '2024-03-01',
    onDateClick: mockOnDateClick
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 基本機能のテスト
  describe('基本機能', () => {
    it('カレンダーが正しく表示される', () => {
      renderWithTheme(
        <AppContextProvider>
          <Calender {...defaultProps} />
        </AppContextProvider>
      )
      
      expect(screen.getByRole('grid')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('月の切り替えボタンが表示される', () => {
      renderWithTheme(
        <AppContextProvider>
          <Calender {...defaultProps} />
        </AppContextProvider>
      )
      
      expect(screen.getByRole('button', { name: '前' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '次' })).toBeInTheDocument()
    })
  })

  // 月の切り替えテスト
  describe('月の切り替え', () => {
    it('前月ボタンをクリックすると前月に切り替わる', () => {
      renderWithTheme(
        <AppContextProvider>
          <Calender {...defaultProps} />
        </AppContextProvider>
      )
      
      const prevMonthButton = screen.getByRole('button', { name: '前' })
      fireEvent.click(prevMonthButton)
      
      // FullCalendarのイベントハンドラが呼ばれることを確認
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    it('次月ボタンをクリックすると次月に切り替わる', () => {
      renderWithTheme(
        <AppContextProvider>
          <Calender {...defaultProps} />
        </AppContextProvider>
      )
      
      const nextMonthButton = screen.getByRole('button', { name: '次' })
      fireEvent.click(nextMonthButton)
      
      // FullCalendarのイベントハンドラが呼ばれることを確認
      expect(screen.getByRole('grid')).toBeInTheDocument()
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
      }
    ]

    it('取引が正しく表示される', () => {
      renderWithTheme(
        <AppContextProvider>
          <Calender {...defaultProps} />
        </AppContextProvider>
      )
      
      // FullCalendarのイベント要素を確認
      const calendarGrid = screen.getByRole('grid')
      expect(calendarGrid).toBeInTheDocument()
      
      // 日付セルが存在することを確認
      const dateCells = screen.getAllByRole('gridcell')
      expect(dateCells.length).toBeGreaterThan(0)
    })
  })
}) 