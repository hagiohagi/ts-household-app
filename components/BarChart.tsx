import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import CircularProgress from '@mui/material/CircularProgress';
import { Bar } from 'react-chartjs-2';
import { calculateDailyBalances } from '../utils/financeCalculation';
import { Transaction } from '../types';
import { Box, Typography, useTheme } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// interface BarChartProps {
//   monthlyTransactions: Transaction[]
//   isLoading: boolean
// }
const BarChart = (
  // { monthlyTransactions, isLoading }: BarChartProps
) => {
  const { isLoading } = useAppContext();
  const monthlyTransactions = useMonthlyTransactions();
  const theme = useTheme();
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        title: {
        display: true,
        text: '日別収支',
      },
    },
  };
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  //日毎のlabelを生成
  const dateLabels = Object.keys(dailyBalances).sort();
  //日毎の収入額を生成
  const incomeData = dateLabels.map((day) => dailyBalances[day].income);
  //日毎の支出額を生成
  const expenseData = dateLabels.map((day) => dailyBalances[day].expense);
  const data: ChartData<"bar"> = {
    labels: dateLabels,
    datasets: [
      {
        label: '支出',
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.light,
      },
      {
        label: '収入',
        data: incomeData,
        backgroundColor: theme.palette.incomeColor.light,
      },
    ],
  };
  return (
    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {isLoading ? (<CircularProgress />) : monthlyTransactions.length > 0 ? (< Bar options={options} data={data} />) : <Typography>データがありません</Typography>}
    </Box >
  )
}

export default BarChart