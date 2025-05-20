import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { JSX, useContext, useEffect, useState, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import AlarmIcon from '@mui/icons-material/Alarm'
import AddHomeIcon from '@mui/icons-material/AddHome'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import TrainIcon from '@mui/icons-material/Train'
import WorkIcon from '@mui/icons-material/Work'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import SavingsIcon from '@mui/icons-material/Savings'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExpenseCategory, IncomeCategory, Transaction } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod"
import { Schema, transactionSchema } from "../../validations/schema";
import { AppContext, useAppContext } from "../../context/AppContext";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean
  currentDay: string
  // onSaveTransaction: (transaction: Schema) => Promise<void>
  // onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>
  // onUpdateTransaction: (Transaction: Schema, transactionId: string) => Promise<void>
  selectedTransaction: Transaction | null
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
  // isMobile: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element
}

type incomeExpense = "income" | "expense"

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  // onSaveTransaction,
  // onDeleteTransaction,
  // onUpdateTransaction,
  selectedTransaction,
  setSelectedTransaction,
  // isMobile,
  isDialogOpen,
  setIsDialogOpen
}: TransactionFormProps) => {
  const { control, setValue, watch, formState: { errors }, handleSubmit, reset } = useForm<Schema>({
    defaultValues: {
      type: "expense" as "income" | "expense",
      date: currentDay,
      amount: 0,
      category: "" as "" | "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費" | "給与" | "副収入" | "お小遣い",
      content: "",
    },
    resolver: zodResolver(transactionSchema),
  });
  const { isMobile, onSaveTransaction, onDeleteTransaction, onUpdateTransaction } = useAppContext();

  const formWidth = 320;
  const expenseCategories = useMemo<CategoryItem[]>(() => [
    { label: "食費", icon: <FastfoodIcon fontSize='small' /> },
    { label: "日用品", icon: <AlarmIcon fontSize='small' /> },
    { label: "住居費", icon: <AddHomeIcon fontSize='small' /> },
    { label: "交際費", icon: <Diversity3Icon fontSize='small' /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize='small' /> },
    { label: "交通費", icon: <TrainIcon fontSize='small' /> },
  ], []);

  const incomeCategories = useMemo<CategoryItem[]>(() => [
    { label: "給与", icon: <WorkIcon fontSize='small' /> },
    { label: "副収入", icon: <AddBusinessIcon fontSize='small' /> },
    { label: "お小遣い", icon: <SavingsIcon fontSize='small' /> },
  ], []);
  //収支タイプを切り替える関数
  const incomeExpenseToggle = (type: incomeExpense) => {
    setValue("type", type);
    setValue("category", "");
  };
  const [categories, setCategories] = useState(expenseCategories)
  //収支タイプを監視
  const currentType = watch("type");
  useEffect(() => {
    const newCategories = currentType === "expense" ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType,expenseCategories,incomeCategories]);
  useEffect(() => {
    setValue("date", currentDay)
  }, [currentDay, setValue]);

  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id).then(() => {
        setSelectedTransaction(null);
        if (isMobile) {
          setIsDialogOpen(false);
        }
      }).catch((error) => {
        console.error(error);
      })
    } else {
      onSaveTransaction(data).then(() => {

      }).catch((error) => {
        console.error(error);
      })
    }
    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "" as "" | "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費" | "給与" | "副収入" | "お小遣い",
      content: "",
    });
  };
  useEffect(() => {
    //選択肢が更新されたか確認
    if (selectedTransaction) {
      const categoryExists = categories.some((category) => category.label === selectedTransaction.category);
      setValue("category", categoryExists ? selectedTransaction.category : "");
    }
  }, [selectedTransaction, categories, setValue]);
  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "" as "" | "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費" | "給与" | "副収入" | "お小遣い",
        content: "",
      });
    }
  }, [selectedTransaction, currentDay, reset, setValue]);

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id)
      setSelectedTransaction(null);
      if (isMobile) {
        setIsDialogOpen(false);
      }
    }
  }
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      < Box display={"flex"} justifyContent={"space-between"} mb={2} >
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box >
      {/* フォーム要素 */}
      < Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ButtonGroup fullWidth>
                <Button variant={field.value === "expense" ? "contained" : "outlined"} color="error" onClick={() => incomeExpenseToggle("expense")}>
                  支出
                </Button>
                <Button variant={field.value === "income" ? "contained" : "outlined"} onClick={() => incomeExpenseToggle("income")} > 収入</Button>
              </ButtonGroup>
            )}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.date}
                helperText={errors.date?.message}
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )
            }
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.category}
                helperText={errors.category?.message}
                {...field}
                id="カテゴリ"
                label="カテゴリ"
                select
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.label} >
                    <ListItemIcon>
                      {category.icon}
                    </ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}

              </TextField>
            )} />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
              />
            )} />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.content}
                helperText={errors.content?.message}
                {...field}
                label="内容"
                type="text"
              />
            )} />
          {/* 保存ボタン */}
          <Button type="submit" variant="contained" color={currentType === "income" ? "primary" : "error"} fullWidth>
            {selectedTransaction ? "更新" : "保存"}
          </Button>
          {selectedTransaction && (
            <Button onClick={handleDelete} variant="outlined" color={"secondary"} fullWidth>
              削除
            </Button>
          )}

        </Stack >
      </Box >
    </>
  )
  return (
    <>
      {isMobile ? (
        //モバイル用
        <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth={"sm"}>
          <DialogContent>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        //PC用
        <Box
          sx={{
            position: "fixed",
            top: 64,
            right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
            width: formWidth,
            height: "100%",
            bgcolor: "background.paper",
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
              theme.transitions.create("right", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2, // 内部の余白
            boxSizing: "border-box", // ボーダーとパディングをwidthに含める
            boxShadow: "0px 0px 15px -5px #777777",
          }}
        >
          {formContent}
        </Box >
      )}

    </>
  );
};
export default TransactionForm;
