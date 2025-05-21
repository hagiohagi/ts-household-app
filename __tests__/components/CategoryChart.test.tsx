import React from 'react'
import { render, screen } from '@testing-library/react'
import CategoryChart from '@/components/CategoryChart'
import { AppContextProvider } from '@/context/AppContext'
import { Transaction } from '@/types'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'

describe('CategoryChart', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      date: '2024-03-01',
      amount: 1000,
      category: '食費',
      content: 'テスト支出1',
    },
    {
      id: '2',
      type: 'expense',
      date: '2024-03-01',
      amount: 2000,
      category: '交通費',
      content: 'テスト支出2',
    },
  ]

  const renderWithContext = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          {component}
        </AppContextProvider>
      </ThemeProvider>
    )
  }

  it('カテゴリーチャートが正しくレンダリングされる', () => {
    renderWithContext(<CategoryChart />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByLabelText('収支の種類')).toBeInTheDocument()
  })

  it('データがない場合でもチャートが表示される', () => {
    renderWithContext(<CategoryChart />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByLabelText('収支の種類')).toBeInTheDocument()
  })
}) 