import { Contract, ContractFunction } from "@ethersproject/contracts";
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
  tokenId: string | string[];
}

interface KeyValuePair {
  [key: string]: any;
}

export interface TokenMetadata extends KeyValuePair {
  name?: string;
  description?: string;
  image?: string;
  attributes?: object[];
  animation_url?: string;
}

export interface ContractExtended<
  T extends Contract["functions"] = Contract["functions"]
> extends Contract {
  functions: T;
}

export type ERC721Contract = {
  tokenURI: ContractFunction<string>;
} & Contract["functions"];

export type ERC1155Contract = {
  uri: ContractFunction<string>;
} & Contract["functions"];

export interface RequireTokenProps {
  source: TokenSource | TokenSource[];
  render: () => ReactElement;
  renderConnect: () => ReactElement;
  renderChecking: () => ReactElement;
  renderDeclined: () => ReactElement;
  renderUnauthorized: () => ReactElement;
  renderError: (err: Error) => ReactElement;
}
