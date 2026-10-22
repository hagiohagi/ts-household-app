import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import NotFound from '@/app/not-found'

describe('404 Page', () => {
  it('正しくレンダリングされる', () => {
    render(
      <ThemeProvider theme={theme}>
        <NotFound />
      </ThemeProvider>
    )

    // 404メッセージの確認
    expect(screen.getByText('404 - ページが見つかりません')).toBeInTheDocument()
  })
})
