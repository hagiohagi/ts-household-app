import React, { cache, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/Nomatch";
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
import { AppContextProvider } from "./context/AppContext";
import { isFireStoreError } from "./utils/errorHandling";

function App() {

  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(true);

  // // FireStoreErrorかどうか判定する型ガード
  // function isFireStoreError(err: unknown): err is { code: string, message: string } {
  //   return typeof err === "object" && err !== null && "code" in err
  // };

  //取引を保存する処理
  // const handleSaveTransaction = async (transaction: Schema) => {
  //   try {
  //     const docRef = await addDoc(collection(db, "Transactions"), transaction);
  //     const newTransaction = {
  //       id: docRef.id,
  //       ...transaction
  //     } as Transaction;
  //     setTransactions((prevTransaction) => [...prevTransaction, newTransaction]);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.error("FireStoreのエラーは:", err)
  //     } else {
  //       console.error("一般的なエラーは:", err)
  //     }
  //   }
  // };
  // const handleDeleteTransaction = async (transactionIds: string | readonly string[]) => {
  //   //fireStoreのデータ削除
  //   try {
  //     const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds];
  //     for (const id of idsToDelete) {
  //       await deleteDoc(doc(db, "Transactions", id));
  //       const filteredTransaction = transactions.filter((transaction) => !idsToDelete.includes(transaction.id));
  //       setTransactions(filteredTransaction);
  //     }
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.error("FireStoreのエラーは:", err)
  //     } else {
  //       console.error("一般的なエラーは:", err)
  //     }
  //   }
  // };
  // const handleUpdateTransaction = async (transaction: Schema, transactionIds: string) => {
  //   try {
  //     //fireStore更新処理
  //     const docRef = doc(db, "Transactions", transactionIds);
  //     await updateDoc(docRef, transaction);
  //     //画面更新
  //     const updatedTransactions = transactions.map((t) => t.id === transactionIds ? { ...t, ...transaction } : t) as Transaction[]
  //     setTransactions(updatedTransactions);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.error("FireStoreのエラーは:", err)
  //     } else {
  //       console.error("一般的なエラーは:", err)
  //     }
  //   }
  // }

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={
                <Home
                // monthlyTransactions={monthlyTransactions}
                // setCurrentMonth={setCurrentMonth}
                // onSaveTransaction={handleSaveTransaction}
                // onDeleteTransaction={handleDeleteTransaction}
                // onUpdateTransaction={handleUpdateTransaction}
                />
              }
              />
              <Route
                path="/report"
                element={
                  <Report
                  //   currentMonth={currentMonth}
                  //   setCurrentMonth={setCurrentMonth}
                  //   monthlyTransactions={monthlyTransactions}
                  //   isLoading={isLoading}
                  //   onDeleteTransaction={handleDeleteTransaction}
                  />
                }
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
