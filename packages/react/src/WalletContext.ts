import { WalletContextProps } from "index";
import { createContext } from "react";

export const defaultWalletContext: WalletContextProps = {
  connect: async () => {},
};

export const WalletContext = createContext<WalletContextProps>(
  defaultWalletContext
);
