import { Grid, Paper } from "@mui/material";
import React from "react";
import MonthSelector from "../src/components/MonthSelector";
import CategoryChart from "../src/components/CategoryChart";
import BarChart from "../src/components/BarChart";
import TransactionTable from "../src/components/TransactionTable";
import { Transaction } from "../src/types";
import AppLayout from '../src/components/layout/AppLayout';

// interface ReportProps {
//   currentMonth: Date
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
//   monthlyTransactions: Transaction[]
//   isLoading: boolean
//   onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>
// }

// export default function ReportPage() {
//   return (
//     <AppLayout>
//       <Report />
//     </AppLayout>
//   );
// }

const Report = () => {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  }
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        {/* 日付選択エリア */}
        <MonthSelector
        // currentMonth={currentMonth}
        // setCurrentMonth={setCurrentMonth}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={commonPaperStyle}>
          <CategoryChart
          // monthlyTransactions={monthlyTransactions}
          // isLoading={isLoading}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={commonPaperStyle}>
          <BarChart
          // monthlyTransactions={monthlyTransactions}
          // isLoading={isLoading}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TransactionTable
        // monthlyTransactions={monthlyTransactions}
        // onDeleteTransaction={onDeleteTransaction}
        />
      </Grid>
    </Grid>
  )
};

export default function ReportPage() {
  return (
    <AppLayout>
      <Report />
    </AppLayout>
  );
}
