"use client";

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
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ExpenseCategory, IncomeCategory, Transaction } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod"
import { Schema, transactionSchema } from "../../validations/schema";
import { useAppContext } from "../../context/AppContext";
import IconComponents from "../common/IconComponents";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean
  currentDay: string
  selectedTransaction: Transaction | null
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
type incomeExpense = "income" | "expense"

const expenseCategories: ExpenseCategory[] = ["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"];
const incomeCategories: IncomeCategory[] = ["給与", "副収入", "お小遣い"];

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedTransaction,
  setSelectedTransaction,
  isDialogOpen,
  setIsDialogOpen
}: TransactionFormProps) => {
  const emptyValues = (date: string): Schema => ({
    type: "expense",
    date,
    amount: 0,
    category: "",
    content: "",
  });
  const { control, setValue, formState: { errors }, handleSubmit, reset } = useForm<Schema>({
    defaultValues: emptyValues(currentDay),
    resolver: zodResolver(transactionSchema),
  });
  const { isMobile, onSaveTransaction, onDeleteTransaction, onUpdateTransaction } = useAppContext();

  const formWidth = 320;
  //収支タイプを切り替える関数
  const incomeExpenseToggle = (type: incomeExpense) => {
    setValue("type", type);
    setValue("category", "");
  };
  //収支タイプを監視
  const currentType = useWatch({ control, name: "type" });
  const categories = currentType === "expense" ? expenseCategories : incomeCategories;
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
    reset(emptyValues(currentDay));
  };
  useEffect(() => {
    //選択肢が更新されたか確認
    if (selectedTransaction) {
      const categoryExists = (categories as readonly string[]).includes(selectedTransaction.category);
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
      reset(emptyValues(currentDay));
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
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
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <ListItemIcon>
                      {IconComponents[category]}
                    </ListItemIcon>
                    {category}
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

        </Stack>
      </Box>
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
        </Box>
      )}

    </>
  );
};
export default TransactionForm;
