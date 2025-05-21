import {formatMonth,formatCurrency} from '@/utils/formatting';

describe('formatMonth', () => {
  it('正しい年月フォーマットを返す', () => {
    const date = new Date('2024-03-15');
    const formattedDate = formatMonth(date);
    expect(formattedDate).toBe('2024-03');
  });
});

describe('formatCurrency', () => {
  it('3桁区切りの金額を正しくフォーマットする', () => {
    const amount = 1000;
    const formattedAmount = formatCurrency(amount);
    expect(formattedAmount).toBe('1,000');
  });
  it('0を正しくフォーマットする', () => {
    const amount = 0;
    const formattedAmount = formatCurrency(amount);
    expect(formattedAmount).toBe('0');
  });

  it('負の金額を正しくフォーマットする', () => {
    const amount = -1000;
    const formattedAmount = formatCurrency(amount);
    expect(formattedAmount).toBe('-1,000');
  });

  it('小数点以下の金額を正しくフォーマットする', () => {
    const amount = 1000.5;
    const formattedAmount = formatCurrency(amount);
    expect(formattedAmount).toBe('1,000.5');
  });
});