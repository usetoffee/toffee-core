import { ethers } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { WalletContext } from "./WalletContext";
import { accountMatch, getSigner } from "./util";

const uuid = () => Math.random().toString(36).slice(-6);

export const useRequireSignature = (message: string = uuid()) => {
  const { provider, account, chainId } = useContext(WalletContext);

  const [approved, setApproved] = useState<boolean>(false);
  const [signing, setSigning] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  useEffect(() => {
    setSigned(false);
    setApproved(false);
  }, [provider, account, chainId]);

  const request = useCallback(async () => {
    setSigning(true);
    const signer = getSigner(provider);
    const response = await signer.signMessage(message);
    const verify = ethers.utils.verifyMessage(message, response);
    if (accountMatch(verify, account)) {
      setApproved(true);
    } else {
      setApproved(false);
    }
    setSigning(false);
    setSigned(true);
  }, [provider, account, chainId]);

  return { approved, request, signing, signed };
};
