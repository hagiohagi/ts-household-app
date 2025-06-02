import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { Transaction } from "../../types";
import { db } from "../../firebase";
import { isFireStoreError } from "../../utils/errorHandling";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";

export default function TransactionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setTransactions, setIsLoading } = useAppContext();

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!db) {
          console.error("Firebaseが初期化されていません");
          return;
        }
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        if (!querySnapshot) {
          console.error("データの取得に失敗しました");
          return;
        }
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("FireStoreのエラーは:", err);
        } else {
          console.error("一般的なエラーは:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [setIsLoading, setTransactions, router.pathname]);

  return <>{children}</>;
} 