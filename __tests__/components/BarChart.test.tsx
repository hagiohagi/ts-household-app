import { render, screen } from '@testing-library/react';
import BarChart from '@/components/BarChart';
import { useAppContext } from '@/context/AppContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme/theme';
import useMonthlyTransactions from '@/hooks/useMonthlyTransactions';

// Chart.jsのモック
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

// useAppContextのモックを上書き
jest.mock('@/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// useMonthlyTransactionsのモックを上書き
jest.mock('@/hooks/useMonthlyTransactions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('BarChart', () => {
  const mockMonthlyTransactions = [
    {
      id: '1',
      date: '2024-03-01',
      amount: 1000,
      category: '給与',
      type: 'income',
      description: '給与',
    },
    {
      id: '2',
      date: '2024-03-01',
      amount: 500,
      category: '食費',
      type: 'expense',
      description: '食費',
    },
  ];

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      isLoading: false,
      currentMonth: new Date('2024-03-01'),
    });
    (useMonthlyTransactions as jest.Mock).mockReturnValue(mockMonthlyTransactions);
  });

  it('ローディング中はCircularProgressが表示される', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      isLoading: true,
      currentMonth: new Date('2024-03-01'),
    });
    renderWithTheme(<BarChart />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('データがない場合は「データがありません」が表示される', () => {
    (useMonthlyTransactions as jest.Mock).mockReturnValue([]);
    renderWithTheme(<BarChart />);
    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  it('データがある場合はBarChartが表示される', () => {
    renderWithTheme(<BarChart />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });
}); 