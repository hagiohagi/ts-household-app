"use client";

import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { Transaction } from "../../types";
import { db } from "../../firebase";
import { isFireStoreError } from "../../utils/errorHandling";
import { useAppContext } from "../../context/AppContext";

interface TransactionProviderProps {
  children: React.ReactNode;
}

// 起動時に一度だけFireStoreから取引データを取得する
export default function TransactionProvider({ children }: TransactionProviderProps) {
  const { setTransactions, setIsLoading } = useAppContext();

  React.useEffect(() => {
    let ignore = false;
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        const transactionsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Transaction[];
        if (!ignore) {
          setTransactions(transactionsData);
        }
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("FireStoreのエラーは:", err);
        } else {
          console.error("一般的なエラーは:", err);
        }
        if (!ignore) {
          setTransactions([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };
    fetchTransactions();
    return () => {
      ignore = true;
    };
  }, [setIsLoading, setTransactions]);

  return <>{children}</>;
}
