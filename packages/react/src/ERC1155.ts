import { ethers } from "ethers";
import { ERC1155Contract } from "./types";
import { ERC1155Abi } from "./abi/ERC1155Abi";
import { useContract } from "./Contract";
import { getSigner } from "./util";

export const getErc1155Contract = (address: string, provider: any) => {
  const signer = getSigner(provider);
  return new ethers.Contract(address, ERC1155Abi, signer);
};

export const useErc1155 = (address: string) =>
  useContract<ERC1155Contract>(address, ERC1155Abi);
