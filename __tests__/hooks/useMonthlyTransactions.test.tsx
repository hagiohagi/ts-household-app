import React from 'react'
import { renderHook } from '@testing-library/react'
import useMonthlyTransactions from '@/hooks/useMonthlyTransactions'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import { Transaction } from '@/types'

describe('useMonthlyTransactions', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      date: '2024-03-01',
      amount: 1000,
      category: '食費',
      content: '3月の支出1',
    },
    {
      id: '2',
      type: 'income',
      date: '2024-02-28',
      amount: 5000,
      category: '給与',
      content: '2月の収入',
    },
    {
      id: '3',
      type: 'expense',
      date: '2024-03-15',
      amount: 2000,
      category: '交通費',
      content: '3月の支出2',
    },
  ]

  const TestComponent = ({ children }: { children: React.ReactNode }) => {
    const { setTransactions, setCurrentMonth } = useAppContext()
    React.useEffect(() => {
      setTransactions(mockTransactions)
      setCurrentMonth(new Date('2024-03-01'))
    }, [setTransactions, setCurrentMonth])
    return <>{children}</>
  }

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppContextProvider>
      <TestComponent>
        {children}
      </TestComponent>
    </AppContextProvider>
  )

  it('指定された月の取引のみを返す', () => {
    const { result } = renderHook(() => useMonthlyTransactions(), {
      wrapper,
    })

    expect(result.current).toHaveLength(2)
    expect(result.current[0].date).toBe('2024-03-01')
    expect(result.current[1].date).toBe('2024-03-15')
  })

  it('取引がない場合は空配列を返す', () => {
    const EmptyTestComponent = ({ children }: { children: React.ReactNode }) => {
      const { setTransactions, setCurrentMonth } = useAppContext()
      React.useEffect(() => {
        setTransactions([])
        setCurrentMonth(new Date('2024-03-01'))
      }, [setTransactions, setCurrentMonth])
      return <>{children}</>
    }

    const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
      <AppContextProvider>
        <EmptyTestComponent>
          {children}
        </EmptyTestComponent>
      </AppContextProvider>
    )

    const { result } = renderHook(() => useMonthlyTransactions(), {
      wrapper: emptyWrapper,
    })

    expect(result.current).toHaveLength(0)
  })
}) 