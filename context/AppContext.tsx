import { createContext, ReactNode, useContext, useState } from "react";
import { Transaction } from "../types";
import { useMediaQuery, useTheme } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { isFireStoreError } from "../utils/errorHandling";
import { Schema } from "../validations/schema";

interface AppContextType {
  transactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  currentMonth: Date,
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isMobile: boolean,
  onSaveTransaction: (transaction: Schema) => Promise<void>,
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>,
  onUpdateTransaction: (transaction: Schema, transactionIds: string) => Promise<void>,
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  const onSaveTransaction = async (transaction: Schema) => {
    try {
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      const newTransaction = {
        id: docRef.id,
        ...transaction
      } as Transaction;
      setTransactions((prevTransaction) => [...prevTransaction, newTransaction]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  };
  const onDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    //fireStoreのデータ削除
    try {
      const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds];
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, "Transactions", id));
        const filteredTransaction = transactions.filter((transaction) => !idsToDelete.includes(transaction.id));
        setTransactions(filteredTransaction);
      }
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  };
  const onUpdateTransaction = async (transaction: Schema, transactionIds: string) => {
    try {
      //fireStore更新処理
      const docRef = doc(db, "Transactions", transactionIds);
      await updateDoc(docRef, transaction);
      //画面更新
      const updatedTransactions = transactions.map((t) => t.id === transactionIds ? { ...t, ...transaction } : t) as Transaction[]
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  }


  return (
    <AppContext.Provider value={{
      transactions,
      setTransactions,
      currentMonth,
      setCurrentMonth,
      isLoading,
      setIsLoading,
      isMobile,
      onSaveTransaction,
      onDeleteTransaction,
      onUpdateTransaction
    }}>
      {children}
    </AppContext.Provider >
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    //contextがundefinedの場合の処理
    throw new Error("グローバルなデータはプロバーダーの中で取得してください")
  }
  return context;
}