import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useWalletContext } from "src";

export const useTransaction = (tx?: string) => {
  const { provider } = useWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [receipt, setReceipt] = useState<providers.TransactionReceipt>();

  useEffect(() => {
    if (tx && provider) {
      setLoading(true);
      (async () => {
        try {
          const _receipt = await provider.sendAsync({
            method: "eth_getTransactionReceipt",
            params: [tx],
          });
          setReceipt(_receipt);
        } catch (e) {
          const err: any = e;
          setError(err);
        }
        setLoading(false);
      })();
    }
  }, [tx, provider]);

  return { receipt, loading, error };
};
