import { render, screen, fireEvent } from '@testing-library/react';
import CategoryChart from '@/components/CategoryChart';
import { useAppContext } from '@/context/AppContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme/theme';
import useMonthlyTransactions from '@/hooks/useMonthlyTransactions';

// Chart.jsのモック
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="mock-pie-chart" />,
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

describe('CategoryChart', () => {
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
    });
    (useMonthlyTransactions as jest.Mock).mockReturnValue(mockMonthlyTransactions);
  });

  it('ローディング中はCircularProgressが表示される', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      isLoading: true,
    });
    renderWithTheme(<CategoryChart />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('データがない場合は「データがありません」が表示される', () => {
    (useMonthlyTransactions as jest.Mock).mockReturnValue([]);
    renderWithTheme(<CategoryChart />);
    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  it('収支の種類を切り替えられる', () => {
    renderWithTheme(<CategoryChart />);
    
    // セレクトボックスを開く
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    // 収入を選択
    const incomeOption = screen.getByRole('option', { name: '収入' });
    fireEvent.click(incomeOption);

    // グラフが表示されていることを確認
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  it('支出を選択した場合、支出のカテゴリーが表示される', () => {
    renderWithTheme(<CategoryChart />);
    
    // セレクトボックスを開く
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    // 支出を選択
    const expenseOption = screen.getByRole('option', { name: '支出' });
    fireEvent.click(expenseOption);

    // グラフが表示されていることを確認
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });
}); 