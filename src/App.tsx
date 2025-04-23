import React, { cache, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Transaction } from "./types/index";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { format } from "date-fns";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";

function App() {
  // FireStoreErrorかどうか判定する型ガード
  function isFireStoreError(err: unknown): err is { code: string, message: string } {
    return typeof err === "object" && err !== null && "code" in err
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // firestoreのデータを全て取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"))
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        })
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("FireStoreのエラーは:", err)
        } else {
          console.error("一般的なエラーは:", err)
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, [])

  // 一月分のデータのみを取得
  const monthlyTransactions = transactions.filter((transactions) => {
    return transactions.date.startsWith(formatMonth(currentMonth));
  })

  //取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
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
  const handleDeleteTransaction = async (transactionId: string) => {
    //fireStoreのデータ削除
    try {
      await deleteDoc(doc(db, "Transactions", transactionId));
      const filteredTransaction = transactions.filter((transaction) => transaction.id !== transactionId);
      setTransactions(filteredTransaction);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  };
  const handleUpdateTransaction = async (transaction: Schema, transactionId: string) => {
    try {
      //fireStore更新処理
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transaction);
      //画面更新
      const updatedTransactions = transactions.map((t) => t.id === transactionId ? { ...t, ...transaction } : t) as Transaction[]
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={
              <Home
                monthlyTransactions={monthlyTransactions}
                setCurrentMonth={setCurrentMonth}
                onSaveTransaction={handleSaveTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onUpdateTransaction={handleUpdateTransaction}
              />
            }
            />
            <Route
              path="/report"
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
