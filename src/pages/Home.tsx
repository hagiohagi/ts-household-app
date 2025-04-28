import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import MonthlySummary from "../components/layout/MonthlySummary";
import Calender from "../components/layout/Calender";
import TransactionMenu from "../components/layout/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";
import { Transaction } from "../types";
import { format } from "date-fns";
import { Schema } from "../validations/schema";
import { DateClickArg } from "@fullcalendar/interaction";
import useMonthlyTransactions from "../hooks/useMonthlyTransactions";
import { useAppContext } from "../context/AppContext";

// interface HomeProps {
//   monthlyTransactions: Transaction[],
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
//   onSaveTransaction: (transaction: Schema) => Promise<void>,
//   onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>,
//   onUpdateTransaction: (Transaction: Schema, transactionId: string) => Promise<void>
// }

const Home = (
  // {
  // monthlyTransactions,
  // setCurrentMonth,
  // onSaveTransaction,
  // onDeleteTransaction,
  // onUpdateTransaction
  // }: HomeProps
) => {
  const { isMobile } = useAppContext();
  const monthlyTransactions = useMonthlyTransactions();
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen,] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const dailyTransactions = useMemo(() => {
    return monthlyTransactions.filter((transaction) =>
      transaction.date === currentDay
    );
  }, [monthlyTransactions, currentDay]);

  const closeForm = () => {
    setSelectedTransaction(null);
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen)
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }
  //フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  }
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  }

  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  }

  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  }


  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary
        // monthlyTransactions={monthlyTransactions} 
        />
        <Calender
          // monthlyTransactions={monthlyTransactions}
          // setCurrentMonth={setCurrentMonth}
          currentDay={currentDay}
          setCurrentDay={setCurrentDay}
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          // isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          // onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          // onDeleteTransaction={onDeleteTransaction}
          // onUpdateTransaction={onUpdateTransaction}
          // isMobile={isMobile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  );
};

export default Home;
