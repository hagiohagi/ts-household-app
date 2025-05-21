import { format } from "date-fns";

export function formatMonth(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return format(date, "yyyy-MM");
}

// 日本円に変換する
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount');
  }
  return amount.toLocaleString("ja-JP", {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}