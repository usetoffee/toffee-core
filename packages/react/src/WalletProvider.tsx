import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import detectEthereumProivder from "@metamask/detect-provider";
import { throttle } from "throttle-debounce";
import { WalletContext } from "./WalletContext";
import {
  AccountsChangedEvent,
  ConnectEvent,
  WalletContextProps,
} from "./types";
import { useLocalStorage } from "react-use";
import { ethers } from "ethers";

interface WalletProviderProps {
  fallback?: any;
  storage?: string;
}

interface ConnectArgs {
  provider?: any;
}

export const WalletProvider: React.FC<
  PropsWithChildren<WalletProviderProps>
> = ({ fallback, storage, ...props }) => {
  const [provider, setProvider] = useState<any>(fallback);
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<string>();
  const [error, setError] = useState<Error>();

  const [lastAccount, setLastAccount] = useLocalStorage<string>(
    `@usetoffee/${storage}/lastAccount`,
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
            setAccount(ethers.utils.getAddress(account));
            setLastAccount(account);
          }
          setProvider(useProvider);
        } catch (e) {
          const error: any = e;
          if (error.code === -32002) {
            setError(new Error("Please check Ethereum connection"));
          } else {
            setError(new Error(error.message));
          }
        }
      } else {
        const message = "Please check Ethereum connection";
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
                setAccount(ethers.utils.getAddress(account));
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
          timeout: 5000,
        });
      } catch (e) {}
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
