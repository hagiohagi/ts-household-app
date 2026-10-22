import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import { AppContextProvider } from '@/context/AppContext'
import Home from '@/app/page'
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

describe('Home Page', () => {
  it('正しくレンダリングされる', async () => {
    renderWithContext(<Home />)

    // 主要コンポーネントの存在確認
    expect(await screen.findByText('内訳')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: '内訳を追加' })).toBeInTheDocument()
  }, 30000)

  it('入力フォームが正しく開閉される', async () => {
    renderWithContext(<Home />)

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
