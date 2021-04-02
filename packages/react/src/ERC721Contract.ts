import { ethers } from "ethers";
import { ERC721Abi } from "./abi/ERC721Abi";
import { getSigner } from "./util";

export const getErc721Contract = (address: string, provider: any) => {
  const signer = getSigner(provider);
  return new ethers.Contract(address, ERC721Abi, signer);
};
