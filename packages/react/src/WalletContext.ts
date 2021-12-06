import { createContext, useContext } from "react";
import { WalletContextProps } from "./types";

export const defaultWalletContext: WalletContextProps = {
  connect: async () => {},
  disconnect: async () => {},
};

export const WalletContext = createContext<WalletContextProps>(
  defaultWalletContext
);

export const useWalletContext = () => {
  const walletContext = useContext(WalletContext);
  return walletContext;
};
