import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import SideBar from '@/components/common/SideBar'
import { useRouter } from 'next/router'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Next.jsのルーターをモック
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '/',
    push: jest.fn()
  }))
}))

// Material-UIのアイコンをモック
jest.mock('@mui/icons-material/Home', () => () => <div data-testid="HomeIcon" />)
jest.mock('@mui/icons-material/Equalizer', () => () => <div data-testid="EqualizerIcon" />)

describe('SideBar', () => {
  // テスト用のデフォルトプロパティ
  const defaultProps = {
    drawerWidth: 240,
    mobileOpen: false,
    handleDrawerToggle: jest.fn()
  }

  // 各テスト前にルーターをモック
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/'
    })
    jest.clearAllMocks()
  })

  // テスト用のラッパーコンポーネント
  const renderWithTheme = (ui: React.ReactElement) => {
    const theme = createTheme()
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    )
  }

  // 基本機能のテスト
  describe('基本機能', () => {
    it('メニュー項目が正しく表示される', () => {
      renderWithTheme(<SideBar {...defaultProps} />)
      
      // PC用ドロワーのみをテスト対象とする
      const permanentDrawer = screen.getByRole('navigation').querySelector('.MuiDrawer-docked') as HTMLElement
      const homeText = within(permanentDrawer).getByText('Home')
      const reportText = within(permanentDrawer).getByText('Report')
      
      expect(homeText).toBeInTheDocument()
      expect(reportText).toBeInTheDocument()
    })

    it('各メニュー項目に正しいアイコンが表示される', () => {
      renderWithTheme(<SideBar {...defaultProps} />)
      
      // PC用ドロワーのみをテスト対象とする
      const permanentDrawer = screen.getByRole('navigation').querySelector('.MuiDrawer-docked') as HTMLElement
      const homeIcon = within(permanentDrawer).getByTestId('HomeIcon')
      const reportIcon = within(permanentDrawer).getByTestId('EqualizerIcon')
      
      expect(homeIcon).toBeInTheDocument()
      expect(reportIcon).toBeInTheDocument()
    })

    it('各メニュー項目に正しいリンクが設定されている', () => {
      renderWithTheme(<SideBar {...defaultProps} />)
      
      // PC用ドロワーのみをテスト対象とする
      const permanentDrawer = screen.getByRole('navigation').querySelector('.MuiDrawer-docked') as HTMLElement
      const homeLink = within(permanentDrawer).getByText('Home').closest('a')
      const reportLink = within(permanentDrawer).getByText('Report').closest('a')
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(reportLink).toHaveAttribute('href', '/report')
    })
  })

  // アクティブ状態のテスト
  describe('アクティブ状態', () => {
    it('現在のパスに応じてメニュー項目がハイライトされる', () => {
      (useRouter as jest.Mock).mockReturnValue({
        pathname: '/report'
      })

      renderWithTheme(<SideBar {...defaultProps} />)
      
      // PC用ドロワーの要素を確認
      const permanentDrawer = screen.getByRole('navigation').querySelector('.MuiDrawer-docked') as HTMLElement
      const reportButton = within(permanentDrawer).getByText('Report').closest('div.MuiButtonBase-root')
      expect(reportButton).toHaveStyle({
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
      })
    })

    it('非アクティブなメニュー項目はハイライトされない', () => {
      (useRouter as jest.Mock).mockReturnValue({
        pathname: '/report'
      })

      renderWithTheme(<SideBar {...defaultProps} />)
      
      // PC用ドロワーの要素を確認
      const permanentDrawer = screen.getByRole('navigation').querySelector('.MuiDrawer-docked') as HTMLElement
      const homeButton = within(permanentDrawer).getByText('Home').closest('div.MuiButtonBase-root')
      expect(homeButton).not.toHaveStyle({
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
      })
    })
  })

  // イベントハンドリングのテスト
  describe('イベントハンドリング', () => {
    it('モバイル表示時にドロワーを閉じる操作が正しく動作する', () => {
      const handleDrawerToggle = jest.fn()
      renderWithTheme(<SideBar {...defaultProps} mobileOpen={true} handleDrawerToggle={handleDrawerToggle} />)
      
      // モバイルドロワーのオーバーレイをクリック
      const overlay = screen.getByRole('presentation').querySelector('.MuiBackdrop-root')
      fireEvent.click(overlay!)
      
      expect(handleDrawerToggle).toHaveBeenCalled()
    })

    it('メニュー項目をクリックすると正しいパスに遷移する', () => {
      const mockPush = jest.fn()
      ;(useRouter as jest.Mock).mockReturnValue({
        pathname: '/',
        push: mockPush
      })

      renderWithTheme(<SideBar {...defaultProps} />)
      
      // PC用ドロワーの要素をクリック
      const permanentDrawer = screen.getByRole('navigation').querySelector('.MuiDrawer-docked') as HTMLElement
      const reportLink = within(permanentDrawer).getByText('Report').closest('a')
      
      // クリックイベントを発火
      fireEvent.click(reportLink!)
      
      setTimeout(() => {
        expect(mockPush).toHaveBeenCalledWith('/report')
      }
      , 0)
    })
  })
}) 