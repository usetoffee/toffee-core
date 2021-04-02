import { ethers } from "ethers";
import { ERC721Abi } from "src/abi/ERC721Abi";

export const getErc721Contract = (address: string, provider: any) => {
  return new ethers.Contract(address, ERC721Abi, provider);
};
