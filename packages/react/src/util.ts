import { providers } from "ethers";

export const accountMatch = (acc1?: string, acc2?: string) => {
  return String(acc1).toLowerCase() === String(acc2).toLowerCase();
};

export const getSigner = (provider: providers.ExternalProvider) => {
  const ethersProvider = new providers.Web3Provider(provider);
  return ethersProvider.getSigner();
};
