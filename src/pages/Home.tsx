import { Box } from "@mui/material";
import React, { useState } from "react";
import MonthlySummary from "../components/layout/MonthlySummary";
import Calender from "../components/layout/Calender";
import TransactionMenu from "../components/layout/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";
import { Transaction } from "../types";
import { format } from "date-fns";

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay
  });
  const closeForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  }
  //フォームの開閉処理
  const handleAddTransactionForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender monthlyTransactions={monthlyTransactions} setCurrentMonth={setCurrentMonth} currentDay={currentDay} setCurrentDay={setCurrentDay} today={today} />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu dailyTransactions={dailyTransactions} currentDay={currentDay} onAddTransactionForm={handleAddTransactionForm} />
        <TransactionForm onCloseForm={closeForm} isEntryDrawerOpen={isEntryDrawerOpen} currentDay={currentDay} />
      </Box>
    </Box>
  );
};

export default Home;
