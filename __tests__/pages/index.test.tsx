import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@emotion/react'
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
  it('正しくレンダリングされる', async () => {
    renderWithContext(<Index />)
    
    // ヘッダーの存在確認
    expect(await screen.findByText('React×Typescript 家計簿アプリ')).toBeInTheDocument()
    
    // 主要コンポーネントの存在確認
    expect(await screen.findByText('内訳')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: '内訳を追加' })).toBeInTheDocument()
  }, 30000)

  it('入力フォームが正しく開閉される', async () => {
    renderWithContext(<Index />)
    
    // 初期レンダリングの完了を待機
    const inputButton = await screen.findByRole('button', { name: '内訳を追加' })
    expect(inputButton).toBeInTheDocument()

    // 入力ボタンをクリック
    await userEvent.click(inputButton)
    
    // フォームの表示を確認
    expect(await screen.findByLabelText('日付')).toBeInTheDocument()
    expect(await screen.findByLabelText('金額')).toBeInTheDocument()
  }, 30000)
}) 