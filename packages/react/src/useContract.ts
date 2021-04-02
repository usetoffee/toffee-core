import { ContractInterface, ethers } from "ethers";
import { useContext, useMemo } from "react";
import { getSigner } from "./util";
import { WalletContext } from "./WalletContext";

export const useContract = (address: string, abi: ContractInterface) => {
  const { provider } = useContext(WalletContext);
  return useMemo(() => {
    if (provider && address) {
      const signer = getSigner(provider);
      const contract = new ethers.Contract(address, abi, signer);
      return contract;
    } else {
      return undefined;
    }
  }, [address, provider]);
};
