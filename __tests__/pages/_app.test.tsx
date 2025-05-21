import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import { AppContextProvider } from '@/context/AppContext'
import App from '@/pages/_app'

// モックコンポーネント
const MockComponent = () => <div>テストコンポーネント</div>

describe('_app.tsx', () => {
  it('グローバルスタイルが適用される', () => {
    render(
      <App
        Component={MockComponent}
        pageProps={{}}
        router={{} as any}
      />
    )

    // グローバルスタイルの確認
    const html = document.documentElement
    expect(html).toHaveStyle({
      margin: '0',
      padding: '0',
      boxSizing: 'border-box'
    })
  })

  it('AppContextProviderが正しく機能する', () => {
    render(
      <App
        Component={MockComponent}
        pageProps={{}}
        router={{} as any}
      />
    )

    // AppContextProviderの存在確認
    expect(screen.getByText('テストコンポーネント')).toBeInTheDocument()
  })

  it('ThemeProviderが正しく機能する', () => {
    render(
      <App
        Component={MockComponent}
        pageProps={{}}
        router={{} as any}
      />
    )

    // テーマの適用確認
    const container = screen.getByText('テストコンポーネント')
    expect(container).toHaveStyle({
      fontFamily: expect.stringContaining('Noto Sans JP')
    })
  })
}) 