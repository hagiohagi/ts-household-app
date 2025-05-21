import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import { AppContextProvider } from '@/context/AppContext'
import Index from '@/pages/index'
import React from 'react'
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

describe('Index Page', () => {
  it('正しくレンダリングされる', () => {
    renderWithContext(<Index />)
    
    // ヘッダーの存在確認
    expect(screen.getByText('家計簿')).toBeInTheDocument()
    
    // 主要コンポーネントの存在確認
    expect(screen.getByRole('button', { name: '入力' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'レポート' })).toBeInTheDocument()
  })

  it('入力フォームが正しく開閉される', async () => {
    renderWithContext(<Index />)
    
    // 入力ボタンをクリック
    const inputButton = screen.getByRole('button', { name: '入力' })
    await userEvent.click(inputButton)
    
    // フォームが表示されることを確認
    expect(screen.getByText('日付')).toBeInTheDocument()
    expect(screen.getByText('金額')).toBeInTheDocument()
  })
}) 