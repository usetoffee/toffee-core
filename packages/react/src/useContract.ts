import { ContractInterface, ethers } from "ethers";
import { useContext, useMemo } from "react";
import { WalletContext } from "./WalletContext";

export const useContract = (address: string, abi: ContractInterface) => {
  const { provider } = useContext(WalletContext);
  return useMemo(() => {
    if (provider && address) {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const contract = new ethers.Contract(
        address,
        abi,
        ethersProvider.getSigner()
      );
      return contract;
    } else {
      return undefined;
    }
  }, [address, provider]);
};
