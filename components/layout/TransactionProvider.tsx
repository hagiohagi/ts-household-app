import * as React from "react";
import { collection, getDocs } from "firebase/firestore";
import { Transaction } from "../../types";
import { db } from "../../firebase";
import { isFireStoreError } from "../../utils/errorHandling";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

// サーバーサイドでデータを取得する関数
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    if (!db) {
      return {
        props: {
          initialTransactions: [],
        },
      };
    }

    const querySnapshot = await getDocs(collection(db, "Transactions"));
    const transactionsData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Transaction[];

    return {
      props: {
        initialTransactions: transactionsData,
      },
    };
  } catch (err) {
    console.error("サーバーサイドでのデータ取得エラー:", err);
    return {
      props: {
        initialTransactions: [],
      },
    };
  }
};

interface TransactionProviderProps {
  children: React.ReactNode;
  initialTransactions: Transaction[];
}

export default function TransactionProvider({ 
  children, 
  initialTransactions 
}: TransactionProviderProps) {
  const router = useRouter();
  const { setTransactions, setIsLoading } = useAppContext();

  React.useEffect(() => {
    // 初期データを設定（必ず配列として設定）
    setTransactions(initialTransactions || []);
    setIsLoading(true);

    // クライアントサイドでの更新処理
    const fetchTransactions = async () => {
      try {
        if (!db) {
          console.error("Firebaseが初期化されていません");
          setTransactions([]); // エラー時は空配列を設定
          return;
        }

        const querySnapshot = await getDocs(collection(db, "Transactions"));
        if (!querySnapshot) {
          console.error("データの取得に失敗しました");
          setTransactions([]); // エラー時は空配列を設定
          return;
        }

        const transactionsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Transaction[];

        // データが取得できた場合のみ更新
        if (transactionsData && Array.isArray(transactionsData)) {
          setTransactions(transactionsData);
        } else {
          setTransactions([]); // 不正なデータの場合は空配列を設定
        }
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("FireStoreのエラーは:", err);
        } else {
          console.error("一般的なエラーは:", err);
        }
        setTransactions([]); // エラー時は空配列を設定
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [setIsLoading, setTransactions, router.pathname, initialTransactions]);

  return <>{children}</>;
}