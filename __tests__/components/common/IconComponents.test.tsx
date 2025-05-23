import { render } from '@testing-library/react'
import IconComponents from '@/components/common/IconComponents'
import { ExpenseCategory, IncomeCategory } from '@/types'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import AlarmIcon from '@mui/icons-material/Alarm'
import AddHomeIcon from '@mui/icons-material/AddHome'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import TrainIcon from '@mui/icons-material/Train'
import WorkIcon from '@mui/icons-material/Work'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import SavingsIcon from '@mui/icons-material/Savings'

describe('IconComponents', () => {
  // 各カテゴリーのアイコンが正しく定義されているかテスト
  it('各カテゴリーに対応するアイコンが正しく定義されている', () => {
    const { container } = render(
      <div>
        {Object.entries(IconComponents).map(([category, icon]) => (
          <div key={category} data-testid={`icon-${category}`}>
            {icon}
          </div>
        ))}
      </div>
    )

    // 支出カテゴリーのアイコン確認
    expect(container.querySelector('[data-testid="icon-食費"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-日用品"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-住居費"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-交際費"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-娯楽"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-交通費"] svg')).toBeInTheDocument()

    // 収入カテゴリーのアイコン確認
    expect(container.querySelector('[data-testid="icon-給与"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-副収入"] svg')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="icon-お小遣い"] svg')).toBeInTheDocument()
  })

  // アイコンのサイズがsmallに設定されているかテスト
  it('すべてのアイコンがsmallサイズで設定されている', () => {
    const { container } = render(
      <div>
        {Object.entries(IconComponents).map(([category, icon]) => (
          <div key={category} data-testid={`icon-${category}`}>
            {icon}
          </div>
        ))}
      </div>
    )

    const allIcons = container.querySelectorAll('svg')
    allIcons.forEach(icon => {
      // Material-UIのアイコンはfontSizeプロパティをスタイルとして適用
      expect(icon).toHaveStyle({ fontSize: '1.25rem' }) // smallサイズのデフォルト値
    })
  })

  // すべてのカテゴリーがカバーされているかテスト
  it('すべてのカテゴリーがカバーされている', () => {
    const expenseCategories: ExpenseCategory[] = ['食費', '日用品', '住居費', '交際費', '娯楽', '交通費']
    const incomeCategories: IncomeCategory[] = ['給与', '副収入', 'お小遣い']

    // 支出カテゴリーの確認
    expenseCategories.forEach(category => {
      expect(IconComponents).toHaveProperty(category)
    })

    // 収入カテゴリーの確認
    incomeCategories.forEach(category => {
      expect(IconComponents).toHaveProperty(category)
    })
  })

  // 各アイコンの型が正しいかテスト
  it('各カテゴリーのアイコンが正しいコンポーネントを使用している', () => {
    const { container } = render(
      <div>
        {Object.entries(IconComponents).map(([category, icon]) => (
          <div key={category} data-testid={`icon-${category}`}>
            {icon}
          </div>
        ))}
      </div>
    )

    // 支出カテゴリーのアイコン型確認
    expect(container.querySelector('[data-testid="icon-食費"] svg')).toHaveAttribute('data-testid', 'FastfoodIcon')
    expect(container.querySelector('[data-testid="icon-日用品"] svg')).toHaveAttribute('data-testid', 'AlarmIcon')
    expect(container.querySelector('[data-testid="icon-住居費"] svg')).toHaveAttribute('data-testid', 'AddHomeIcon')
    expect(container.querySelector('[data-testid="icon-交際費"] svg')).toHaveAttribute('data-testid', 'Diversity3Icon')
    expect(container.querySelector('[data-testid="icon-娯楽"] svg')).toHaveAttribute('data-testid', 'SportsTennisIcon')
    expect(container.querySelector('[data-testid="icon-交通費"] svg')).toHaveAttribute('data-testid', 'TrainIcon')

    // 収入カテゴリーのアイコン型確認
    expect(container.querySelector('[data-testid="icon-給与"] svg')).toHaveAttribute('data-testid', 'WorkIcon')
    expect(container.querySelector('[data-testid="icon-副収入"] svg')).toHaveAttribute('data-testid', 'AddBusinessIcon')
    expect(container.querySelector('[data-testid="icon-お小遣い"] svg')).toHaveAttribute('data-testid', 'SavingsIcon')
  })
}) 