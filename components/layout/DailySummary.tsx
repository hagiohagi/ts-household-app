import { Box, Card, CardContent, Grid, Theme, Typography } from "@mui/material";
import React from "react";
import { Transaction } from "../../types";
import { financeCalculations } from "../../utils/financeCalculation";
import { formatCurrency } from "../../utils/formatting";

interface DailySummaryProps {
  dailyTransactions: Transaction[]
  columns: number
}

const DailySummary = ({ dailyTransactions, columns }: DailySummaryProps) => {
  const { income, expense, balance } = financeCalculations(dailyTransactions);
  const isThreeColumnsLayout = columns === 3;
  const items = [
    { title: "収入", value: income, xs: isThreeColumnsLayout ? 4 : 6, color: (theme: Theme) => theme.palette.incomeColor.main },
    { title: "支出", value: expense, xs: isThreeColumnsLayout ? 4 : 6, color: (theme: Theme) => theme.palette.expenseColor.main },
    { title: "残高", value: balance, xs: isThreeColumnsLayout ? 4 : 12, color: (theme: Theme) => theme.palette.balanceColor.main },
  ];
  return (
    <Box>
      <Grid container spacing={2}>
        {items.map(({ title, value, xs, color }) => (
          <Grid key={title} size={{ xs }} sx={{ display: "flex" }}>
            <Card
              sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
            >
              <CardContent>
                <Typography variant="body2" noWrap sx={{ textAlign: "center" }}>
                  {title}
                </Typography>
                <Typography
                  sx={{
                    textAlign: "right",
                    fontWeight: "fontWeightBold",
                    color,
                    wordBreak: "break-all"
                  }}
                >
                  ¥{formatCurrency(value)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default DailySummary;
