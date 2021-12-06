import { providers } from "ethers";

export const accountMatch = (acc1?: string, acc2?: string) => {
  return String(acc1).toLowerCase() === String(acc2).toLowerCase();
};

export const getSigner = (provider: providers.ExternalProvider) => {
  const ethersProvider = new providers.Web3Provider(provider);
  return ethersProvider.getSigner();
};

interface GetEtherscanUrlArgs {
  tx?: string;
  address?: string;
  network?: string;
}

export const getEtherscanUrl = (args: GetEtherscanUrlArgs) => {
  const network = args.network ? `${args.network}.` : "";
  const type = args.tx ? "tx" : args.address ? "address" : "";
  const hash = args.tx || args.address || "";
  return `https://${network}etherscan.io/${type}/${hash}`;
};

export const shortenAddress = (
  address: string,
  start: number = 5,
  end: number = 3
) => {
  return `${String(address).substr(0, 2 + start)}...${String(address).substr(
    -end,
    end
  )}`;
};
