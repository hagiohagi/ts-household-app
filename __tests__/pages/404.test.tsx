import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme/theme'
import Custom404 from '@/pages/404'

describe('404 Page', () => {
  it('正しくレンダリングされる', () => {
    render(
      <ThemeProvider theme={theme}>
        <Custom404 />
      </ThemeProvider>
    )
    
    // 404メッセージの確認
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument()
  })
}) 