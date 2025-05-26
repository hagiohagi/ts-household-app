import { render, screen, within } from '@testing-library/react';
import TransactionTable from '@/components/TransactionTable';
import { useAppContext } from '@/context/AppContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme/theme';
import useMonthlyTransactions from '@/hooks/useMonthlyTransactions';
import * as React from 'react';

// useAppContextのモックを上書き
jest.mock('@/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// useMonthlyTransactionsのモックを上書き
jest.mock('@/hooks/useMonthlyTransactions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('TransactionTable', () => {
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
      currentMonth: new Date('2024-03-01'),
    });
    (useMonthlyTransactions as jest.Mock).mockReturnValue(mockMonthlyTransactions);
  });

  it('データがない場合は「データがありません」が表示される', () => {
    (useMonthlyTransactions as jest.Mock).mockReturnValue([]);
    renderWithTheme(<TransactionTable />);
    expect(screen.getByTestId('no-data-message')).toBeInTheDocument();
  });

  it('収入、支出、残高が表示される', () => {
    renderWithTheme(<TransactionTable />);
    
    // 収入、支出、残高のコンテナを取得
    const financialItems = screen.getAllByTestId('financial-item');
    const [incomeContainer, expenseContainer, balanceContainer] = financialItems;
    
    // 収入の金額を確認
    expect(within(incomeContainer).getByText('¥1,000')).toBeInTheDocument();
    
    // 支出の金額を確認
    expect(within(expenseContainer).getByText('¥500')).toBeInTheDocument();
    
    // 残高を確認（収入 - 支出）
    expect(within(balanceContainer).getByText('¥500')).toBeInTheDocument();
  });
}); 