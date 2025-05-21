import { financeCalculations } from '@/utils/financeCalculation'
import { Transaction } from '@/types'

describe('financeCalculations', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      date: '2024-03-01',
      amount: 1000,
      category: '食費',
      content: 'テスト支出1',
    },
    {
      id: '2',
      type: 'income',
      date: '2024-03-01',
      amount: 5000,
      category: '給与',
      content: 'テスト収入1',
    },
    {
      id: '3',
      type: 'expense',
      date: '2024-03-02',
      amount: 2000,
      category: '交通費',
      content: 'テスト支出2',
    },
  ]

  it('正しい収入合計を計算する', () => {
    const result = financeCalculations(mockTransactions)
    expect(result.income).toBe(5000)
  })

  it('正しい支出合計を計算する', () => {
    const result = financeCalculations(mockTransactions)
    expect(result.expense).toBe(3000)
  })

  it('正しい収支バランスを計算する', () => {
    const result = financeCalculations(mockTransactions)
    expect(result.balance).toBe(2000)
  })

  it('空の配列の場合、すべての値が0になる', () => {
    const result = financeCalculations([])
    expect(result.income).toBe(0)
    expect(result.expense).toBe(0)
    expect(result.balance).toBe(0)
  })
}) 