import { render, screen } from '@testing-library/react';
import MonthSelector from '@/components/MonthSelector';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme/theme';
import { useAppContext } from '@/context/AppContext';

// useAppContextのモックを上書き
jest.mock('@/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

describe('MonthSelector', () => {
  const mockSetCurrentMonth = jest.fn();
  const mockCurrentMonth = new Date('2024-03-01');

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      currentMonth: mockCurrentMonth,
      setCurrentMonth: mockSetCurrentMonth,
    });
  });

  it('DatePickerが表示される', () => {
    renderWithTheme(<MonthSelector />);
    const datePicker = screen.getByRole('group', { name: /年月を選択/i });
    expect(datePicker).toBeInTheDocument();
  });

  it('先月・次月ボタンが表示される', () => {
    renderWithTheme(<MonthSelector />);
    expect(screen.getByRole('button', { name: '先月' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '次月' })).toBeInTheDocument();
  });
}); 