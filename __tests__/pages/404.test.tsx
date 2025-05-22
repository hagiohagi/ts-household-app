import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '@/theme/theme'
import Page404 from '@/pages/404'

describe('404 Page', () => {
  it('正しくレンダリングされる', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page404 />
      </ThemeProvider>
    )
    
    // 404メッセージの確認
    expect(screen.getByText('このページはありません')).toBeInTheDocument()
  })
}) 