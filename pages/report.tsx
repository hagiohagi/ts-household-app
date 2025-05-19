import { Grid, Paper } from "@mui/material";
import React from "react";
import MonthSelector from "@/components/MonthSelector";
import CategoryChart from "@/components/CategoryChart";
import BarChart from "@/components/BarChart";
import TransactionTable from "@/components/TransactionTable";
import { Transaction } from "@/types";
import AppLayout from '@/components/layout/AppLayout';

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
        <MonthSelector />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={commonPaperStyle}>
          <CategoryChart />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={commonPaperStyle}>
          <BarChart />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TransactionTable />
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
