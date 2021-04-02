import { WalletContextProps, AccountsChangedEvent, ConnectEvent } from "index";
import React, { useEffect, useState } from "react";
import detectEthereumProivder from "@metamask/detect-provider";

import { WalletContext } from "src/WalletContext";

export const WalletProvider: React.FC = (props) => {
  const [provider, setProvider] = useState<any>();
  const [address, setAddress] = useState<string>();
  const [chainId, setChainId] = useState<string>();

  const connect = async () => {
    const provider: any = await detectEthereumProivder();
    setProvider(provider);
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
            setAddress(account);
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
          setAddress(undefined);
        });
      }
    })();
  }, [provider]);

  const value: WalletContextProps = {
    address,
    chainId,
    connect,
    provider,
  };

  return <WalletContext.Provider value={value} {...props} />;
};
