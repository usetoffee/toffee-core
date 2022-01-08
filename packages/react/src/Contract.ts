import { Contract, ContractInterface, ethers } from "ethers";
import { DependencyList, useContext, useMemo } from "react";
import { ContractExtended } from "./types";
import { getSigner } from "./util";
import { WalletContext } from "./WalletContext";

export const useContract = <T extends Contract["functions"]>(
  address: string,
  abi: ContractInterface,
  deps: DependencyList = []
) => {
  const { provider, chainId, account } = useContext(WalletContext);
  return useMemo(() => {
    if (provider && address) {
      return getContract<T>(address, abi, provider);
    } else {
      return undefined;
    }
  }, [address, provider, chainId, account, ...deps]);
};


export const getContract = <T extends Contract["functions"]>(address: string, abi: ContractInterface, provider: any) => {
  const signer = getSigner(provider);
  const contract: ContractExtended<T> = new ethers.Contract(
    address,
    abi,
    signer
  ) as ContractExtended<T>;
  return contract;
}