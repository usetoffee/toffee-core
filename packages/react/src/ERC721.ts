import { ethers } from "ethers";
import { ERC721Contract } from "./types";
import { ERC721Abi } from "./abi/ERC721Abi";
import { useContract } from "./Contract";
import { getSigner } from "./util";

export const getErc721Contract = (address: string, provider: any) => {
  const signer = getSigner(provider);
  return new ethers.Contract(address, ERC721Abi, signer);
};

export const useErc721 = (address: string) =>
  useContract<ERC721Contract>(address, ERC721Abi);
