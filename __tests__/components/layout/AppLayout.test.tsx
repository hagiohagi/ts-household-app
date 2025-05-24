import { render, screen, fireEvent, act } from '@testing-library/react'
import AppLayout from '@/components/layout/AppLayout'
import { ThemeProvider } from '@mui/material/styles'
import { AppContextProvider } from '@/context/AppContext'
import { theme } from '@/theme/theme'

// テスト用のラッパーコンポーネント
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  )
}

describe('AppLayout', () => {
  // レイアウトのテスト
  describe('レイアウト', () => {
    it('ヘッダーが正しく表示される', async () => {
      await act(async () => {
        renderWithTheme(
          <AppContextProvider>
            <AppLayout>
              <div>テストコンテンツ</div>
            </AppLayout>
          </AppContextProvider>
        )
      })
      
      expect(screen.getByText('React×Typescript 家計簿アプリ')).toBeInTheDocument()
    })

    it('サイドバーが正しく表示される', async () => {
      await act(async () => {
        renderWithTheme(
          <AppContextProvider>
            <AppLayout>
              <div>テストコンテンツ</div>
            </AppLayout>
          </AppContextProvider>
        )
      })
      
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('メインコンテンツが正しく表示される', async () => {
      await act(async () => {
        renderWithTheme(
          <AppContextProvider>
            <AppLayout>
              <div>テストコンテンツ</div>
            </AppLayout>
          </AppContextProvider>
        )
      })
      
      expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
    })
  })

  // モバイル表示のテスト
  describe('モバイル表示', () => {
    it('モバイル表示時に正しいレイアウトが適用される', async () => {
      await act(async () => {
        renderWithTheme(
          <AppContextProvider>
            <AppLayout>
              <div>テストコンテンツ</div>
            </AppLayout>
          </AppContextProvider>
        )
      })
      
      const menuButton = screen.getByRole('button', { name: /open drawer/i })
      expect(menuButton).toBeInTheDocument()
    })

    it('メニューボタンをクリックするとサイドバーが開く', async () => {
      await act(async () => {
        renderWithTheme(
          <AppContextProvider>
            <AppLayout>
              <div>テストコンテンツ</div>
            </AppLayout>
          </AppContextProvider>
        )
      })
      
      const menuButton = screen.getByRole('button', { name: /open drawer/i })
      
      await act(async () => {
        fireEvent.click(menuButton)
      })
      
      // サイドバーが開いた状態を確認
      expect(screen.getByRole('list')).toBeVisible()
    })
  })
}) 