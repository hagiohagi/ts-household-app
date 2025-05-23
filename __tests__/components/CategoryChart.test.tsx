import React from 'react'
import { render, screen } from '@testing-library/react'
import CategoryChart from '@/components/CategoryChart'
import { AppContextProvider } from '@/context/AppContext'
import { Transaction } from '@/types'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'

describe('CategoryChart', () => {

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