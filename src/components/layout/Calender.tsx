import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import "../../calendar.css"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { calculateDailyBalances } from '../../utils/financeCalculation'
import { Balance, CalendarContent, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'

interface CalenderProps {
  monthlyTransactions: Transaction[]
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  currentDay: string,
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>
  today: string,
}

const Calender = ({ monthlyTransactions, setCurrentMonth, currentDay, setCurrentDay, today }: CalenderProps) => {
  const events = [
    { title: 'Meeting', start: new Date() }
  ]

  const theme = useTheme();

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className='money' id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  const dailyBalances = calculateDailyBalances(monthlyTransactions);

  const createCalendarEvents = (dailyBalances: Record<string, Balance>): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      }
    })
  }

  const calendarEvents = createCalendarEvents(dailyBalances);
  const handleDatesSet = (datesSetInfo: DatesSetArg) => {
    const currentMonth = datesSetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    };
  }
  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
  }
  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDatesSet}
      dateClick={handleDateClick}
    />
  )
}

export default Calender