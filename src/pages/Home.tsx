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
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay
  });
  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender monthlyTransactions={monthlyTransactions} setCurrentMonth={setCurrentMonth} currentDay={currentDay} setCurrentDay={setCurrentDay} today={today} />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu dailyTransactions={dailyTransactions} currentDay={currentDay} />
        <TransactionForm />
      </Box>
    </Box>
  );
};

export default Home;
