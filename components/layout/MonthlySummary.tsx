"use client";

import { Box, Card, CardContent, Stack, Theme, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import React from 'react'
import { financeCalculations } from '../../utils/financeCalculation';
import { formatCurrency } from '../../utils/formatting';
import useMonthlyTransactions from '../../hooks/useMonthlyTransactions';

const MonthlySummary = () => {
  const monthlyTransactions = useMonthlyTransactions();
  const { income, expense, balance } = financeCalculations(monthlyTransactions)
  const items = [
    { title: "収入", value: income, Icon: ArrowUpwardIcon, bgcolor: (theme: Theme) => theme.palette.incomeColor.main },
    { title: "支出", value: expense, Icon: ArrowDownwardIcon, bgcolor: (theme: Theme) => theme.palette.expenseColor.main },
    { title: "残高", value: balance, Icon: AccountBalanceIcon, bgcolor: (theme: Theme) => theme.palette.balanceColor.main },
  ];
  return (
    <Box>
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 2 }}>
        {items.map(({ title, value, Icon, bgcolor }) => (
          <Grid key={title} size={{ xs: 4 }} sx={{ display: "flex", flexDirection: "column" }}>
            <Card sx={{ bgcolor, color: "white", borderRadius: "10px", flexGrow: 1 }}>
              <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
                <Stack direction={"row"}>
                  <Icon sx={{ fontSize: "2rem" }} />
                  <Typography>{title}</Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "right",
                    fontWeight: "fontWeightBold",
                    fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                    wordBreak: "break-word"
                  }}
                >{formatCurrency(value)}円</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MonthlySummary
