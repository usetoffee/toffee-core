import { createContext } from "react";
import { WalletContextProps } from "./";

export const defaultWalletContext: WalletContextProps = {
  connect: async () => {},
};

export const WalletContext = createContext<WalletContextProps>(
  defaultWalletContext
);
