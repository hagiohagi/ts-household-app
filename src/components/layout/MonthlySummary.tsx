import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import React from 'react'
import { Transaction } from '../../types';
import { financeCalculations } from '../../utils/financeCalculation';
import { formatCurrency } from '../../utils/formatting';

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const { income, expense, balance } = financeCalculations(monthlyTransactions)
  return (
    <Box>
      <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
        {/* 収入 */}
        <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
          <Card sx={{ bgcolor: (theme) => theme.palette.incomeColor.main, color: "white", borderRadius: "10px", flexGrow: 1 }}>
            <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
              <Stack direction={"row"}>
                <ArrowUpwardIcon sx={{ fontSize: "2rem" }} />
                <Typography>収入</Typography>
              </Stack>
              <Typography
                textAlign={"right"}
                variant="h5"
                fontWeight={"fontWeightBold"}
                sx={{
                  fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                  wordBreak: "break-word"
                }}
              >{formatCurrency(income)}円</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 支出 */}
        <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
          <Card sx={{ bgcolor: (theme) => theme.palette.expenseColor.main, color: "white", borderRadius: "10px", flexGrow: 1 }}>
            <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
              <Stack direction={"row"}>
                <ArrowDownwardIcon sx={{ fontSize: "2rem" }} />
                <Typography>支出</Typography>
              </Stack>
              <Typography
                textAlign={"right"}
                variant="h5"
                fontWeight={"fontWeightBold"}
                sx={{
                  fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                  wordBreak: "break-word"
                }}
              >{formatCurrency(expense)}円</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 残高 */}
        <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
          <Card sx={{ bgcolor: (theme) => theme.palette.balanceColor.main, color: "white", borderRadius: "10px", flexGrow: 1 }}>
            <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
              <Stack direction={"row"}>
                <AccountBalanceIcon sx={{ fontSize: "2rem" }} />
                <Typography>残高</Typography>
              </Stack>
              <Typography
                textAlign={"right"}
                variant="h5"
                fontWeight={"fontWeightBold"}
                sx={{
                  fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                  wordBreak: "break-word"
                }}
              >{formatCurrency(balance)}円</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MonthlySummary