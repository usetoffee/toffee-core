import React, { useEffect, useState } from "react";
import detectEthereumProivder from "@metamask/detect-provider";

import { WalletContext } from "./WalletContext";
import {
  AccountsChangedEvent,
  ConnectEvent,
  WalletContextProps,
} from "./types";
import { useLocalStorage } from "react-use";

export const WalletProvider: React.FC = (props) => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<string>();
  const [error, setError] = useState<Error>();

  const [lastAccount, setLastAccount] = useLocalStorage<string>(
    `@usetoffee/${window.location.host}/lastAccount`,
    undefined
  );

  const connect = async () => {
    if (provider) {
      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        if (account) {
          setAccount(account);
          setLastAccount(account);
        }
      } catch (e) {
        setError(e);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (provider) {
        provider.on("connect", ({ chainId }: ConnectEvent) => {
          if (chainId) {
            setChainId(chainId);
          }
        });
        provider.on("accountsChanged", (accounts: AccountsChangedEvent) => {
          const account = [...accounts].pop();
          if (account) {
            setAccount(account);
          }
        });
        provider.on("chainChanged", (chainId: string) => {
          if (chainId) {
            setChainId(chainId);
          }
        });
        provider.on("disconnect", () => {
          setProvider(undefined);
          setChainId(undefined);
          setAccount(undefined);
        });
      }
    })();
  }, [provider]);

  useEffect(() => {
    (async () => {
      const provider: any = await detectEthereumProivder({
        timeout: 1000,
        silent: true,
      });
      if (provider) {
        setProvider(provider);
        if (lastAccount) {
          connect();
        }
      }
    })();
  }, [provider, lastAccount]);

  const value: WalletContextProps = {
    account: account,
    error,
    chainId,
    connect,
    provider,
  };

  return <WalletContext.Provider value={value} {...props} />;
};
