import { transactionSchema } from '@/validations/schema'

describe('transactionSchema', () => {
  it('有効な取引データを検証できる', () => {
    const validTransaction = {
      type: 'expense',
      date: '2024-03-15',
      amount: 1000,
      category: '食費',
      content: 'テスト取引',
    }

    const result = transactionSchema.safeParse(validTransaction)
    expect(result.success).toBe(true)
  })

  it('無効な取引データを検証できる', () => {
    const invalidTransaction = {
      type: 'invalid',
      date: '2024-03-15',
      amount: -1000,
      category: '',
      content: '',
    }

    const result = transactionSchema.safeParse(invalidTransaction)
    expect(result.success).toBe(false)
  })

  it('必須フィールドの検証が機能する', () => {
    const missingFields = {
      type: 'expense',
      date: '2024-03-15',
    }

    const result = transactionSchema.safeParse(missingFields)
    expect(result.success).toBe(false)
  })

  it('金額が0以上であることを検証できる', () => {
    const negativeAmount = {
      type: 'expense',
      date: '2024-03-15',
      amount: -1000,
      category: '食費',
      content: 'テスト取引',
    }

    const result = transactionSchema.safeParse(negativeAmount)
    expect(result.success).toBe(false)
  })

  it('内容が空文字列でないことを検証できる', () => {
    const emptyContent = {
      type: 'expense',
      date: '2024-03-15',
      amount: 1000,
      category: '食費',
      content: '', // 空文字列は無効
    }

    const result = transactionSchema.safeParse(emptyContent)
    expect(result.success).toBe(false)
  })

  it('金額が数値であることを検証できる', () => {
    const invalidAmount = {
      type: 'expense',
      date: '2024-03-15',
      amount: '1000', // 文字列は無効
      category: '食費',
      content: 'テスト取引',
    }

    const result = transactionSchema.safeParse(invalidAmount)
    expect(result.success).toBe(false)
  })
}) 