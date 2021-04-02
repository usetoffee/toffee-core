import { ReactElement } from "react";

export interface WalletContextProps {
  chainId?: string;
  account?: string;
  provider?: any;
  error?: Error;
  connect: () => Promise<void>;
}

export interface ConnectEvent {
  chainId: string;
}

export type AccountsChangedEvent = string[];

export interface TokenSource {
  contract: string;
  tokenId: number | number[];
}

export interface RequireTokenProps {
  source: TokenSource | TokenSource[];
  render: () => ReactElement;
  renderConnect: () => ReactElement;
  renderChecking: () => ReactElement;
  renderDeclined: () => ReactElement;
  renderUnauthorized: () => ReactElement;
  renderError: (err: Error) => ReactElement;
}

export * from "./WalletContext";
export * from "./WalletProvider";
export * from "./RequireToken";
export * from "./RequireSignature";
