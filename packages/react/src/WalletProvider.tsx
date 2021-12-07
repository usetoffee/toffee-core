import React, { useCallback, useEffect, useState } from "react";
import detectEthereumProivder from "@metamask/detect-provider";
import { throttle } from "throttle-debounce";
import { WalletContext } from "./WalletContext";
import {
  AccountsChangedEvent,
  ConnectEvent,
  WalletContextProps,
} from "./types";
import { useLocalStorage } from "react-use";

interface WalletProviderProps {
  fallback?: any;
}

interface ConnectArgs {
  provider?: any;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  fallback,
  ...props
}) => {
  const [provider, setProvider] = useState<any>(fallback);
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<string>();
  const [error, setError] = useState<Error>();

  const [lastAccount, setLastAccount] = useLocalStorage<string>(
    `@usetoffee/${window.location.host}/lastAccount`,
    undefined
  );

  const connect = useCallback(
    async (args: ConnectArgs) => {
      const { provider: newProvider } = args || {};
      const useProvider = newProvider || provider;
      setError(undefined);

      if (useProvider) {
        try {
          const accounts = await useProvider.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          if (account) {
            setAccount(account);
            setLastAccount(account);
          }
          setProvider(useProvider);
        } catch (e) {
          const error: any = e;
          if (error.code === -32002) {
            setError(new Error("Please check your Ethereum provider."));
          } else {
            setError(new Error(error.message));
          }
        }
      } else {
        const message = "No Ethereum provider available";
        setError(new Error(message));
      }
    },
    [provider]
  );

  const disconnect = useCallback(async () => {
    try {
      await provider.close();
    } catch (e) {}
    setProvider(undefined);
    setAccount(undefined);
    setChainId(undefined);
    setError(undefined);
  }, [provider]);

  useEffect(() => {
    (async () => {
      if (provider) {
        try {
          provider.on("connect", ({ chainId }: ConnectEvent) => {
            if (chainId) {
              setChainId(chainId);
            }
          });
          provider.on(
            "accountsChanged",
            throttle(500, true, (accounts: AccountsChangedEvent) => {
              const account = accounts[0];
              if (account) {
                setAccount(account);
              }
            })
          );
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
        } catch (e) {}
      }
    })();
  }, [provider]);

  useEffect(() => {
    (async () => {
      let _provider;
      try {
        _provider = await detectEthereumProivder({
          timeout: 1000,
          silent: true,
        });
      } catch (e) {
        setError(new Error(String(e)));
      }
      if (_provider) {
        setProvider(_provider);
        if (lastAccount) {
          try {
            await connect({ provider: _provider });
          } catch (e) {
            console.error(e);
          }
        }
      }
    })();
  }, [lastAccount]);

  const value: WalletContextProps = {
    account,
    error,
    chainId,
    connect,
    disconnect,
    provider,
  };

  return <WalletContext.Provider value={value} {...props} />;
};
