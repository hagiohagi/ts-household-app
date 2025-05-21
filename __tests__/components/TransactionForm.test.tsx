import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransactionForm from '@/components/layout/TransactionForm'
import { AppContextProvider } from '@/context/AppContext'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'

describe('TransactionForm', () => {
  const mockProps = {
    onCloseForm: jest.fn(),
    isEntryDrawerOpen: true,
    currentDay: '2024-03-15',
    selectedTransaction: null,
    setSelectedTransaction: jest.fn(),
    isDialogOpen: false,
    setIsDialogOpen: jest.fn(),
  }

  const renderWithContext = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          {component}
        </AppContextProvider>
      </ThemeProvider>
    )
  }

  it('初期状態で正しくレンダリングされる', () => {
    renderWithContext(<TransactionForm {...mockProps} />)
    
    expect(screen.getByText('入力')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '支出' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '収入' })).toBeInTheDocument()
    expect(screen.getByLabelText('日付')).toHaveValue('2024-03-15')
    expect(screen.getByRole('spinbutton', { name: '金額' })).toHaveValue(null)
    expect(screen.getByRole('combobox', { name: 'カテゴリ' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '内容' })).toHaveValue('')
  })

  it('収入/支出の切り替えが正しく機能する', async () => {
    renderWithContext(<TransactionForm {...mockProps} />)
    
    const incomeButton = screen.getByRole('button', { name: '収入' })
    await userEvent.click(incomeButton)
    
    const categorySelect = screen.getByRole('combobox', { name: 'カテゴリ' })
    await userEvent.click(categorySelect)
    
    expect(screen.getByText('salary')).toBeInTheDocument()
    expect(screen.getByText('side_income')).toBeInTheDocument()
    expect(screen.getByText('pocket_money')).toBeInTheDocument()
  })

  it('閉じるボタンが正しく機能する', async () => {
    renderWithContext(<TransactionForm {...mockProps} />)
    
    const closeButton = screen.getByTestId('CloseIcon').closest('button')
    await userEvent.click(closeButton!)
    
    expect(mockProps.onCloseForm).toHaveBeenCalled()
  })
})