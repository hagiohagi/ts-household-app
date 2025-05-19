import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import MonthlySummary from "@/components/layout/MonthlySummary";
import Calender from "@/components/layout/Calender";
import TransactionMenu from "@/components/layout/TransactionMenu";
import TransactionForm from "@/components/layout/TransactionForm";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { Schema } from "@/validations/schema";
import { DateClickArg } from "@fullcalendar/interaction";
import useMonthlyTransactions from "@/hooks/useMonthlyTransactions";
import { useAppContext } from "@/context/AppContext";

const Home = () => {
  const { isMobile } = useAppContext();
  const monthlyTransactions = useMonthlyTransactions();
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen,] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        />
        <Calender
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
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  );
};

export default Home;
