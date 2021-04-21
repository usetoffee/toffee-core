import { getDefaultProvider, providers } from "ethers";
import { useEffect, useState } from "react";

export const useTransaction = (tx?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [receipt, setReceipt] = useState<providers.TransactionReceipt>();

  useEffect(() => {
    if (tx) {
      setLoading(true);
      (async () => {
        try {
          const provider = getDefaultProvider();
          const _receipt = await provider.getTransactionReceipt(tx);
          setReceipt(_receipt);
        } catch (e) {
          setError(e);
        }
        setLoading(false);
      })();
    }
  }, [tx]);

  return { receipt, loading, error };
};
