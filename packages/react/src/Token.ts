import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useErc1155 } from "./ERC1155";
import { useErc721 } from "./ERC721";
import { TokenMetadata } from "./types";
import { WalletContext } from "./WalletContext";

export const useTokenMetadata = (
  contract: string | undefined,
  tokenId: string | undefined
) => {
  const { account, provider, chainId } = useContext(WalletContext);

  const [tokenUri, setTokenUri] = useState<string>();
  const [metadata, setMetadata] = useState<TokenMetadata>();
  const [loading, setLoading] = useState<boolean>(true);

  const erc721Contract = useErc721(contract || "");
  const erc1155Contract = useErc1155(contract || "");

  useEffect(() => {
    (async () => {
      let result;
      let _tokenUri;
      try {
        if (!result) {
          result = await erc721Contract?.functions.tokenURI(tokenId);
        }
      } catch (e) {}
      try {
        if (!result) {
          result = await erc1155Contract?.functions.uri(tokenId);
        }
      } catch (e) {}
      if (Array.isArray(result)) {
        [_tokenUri] = result;
      } else if (typeof result === "string") {
        _tokenUri = result;
      }
      if (_tokenUri) {
        _tokenUri = _tokenUri.replace("0x{id}", tokenId);
        _tokenUri = _tokenUri.replace("{id}", tokenId);
        setTokenUri(_tokenUri);
      }
    })();
  }, [account, provider, chainId, contract, tokenId]);

  useEffect(() => {
    (async () => {
      if (tokenUri) {
        const { data: _metadata } = await axios(tokenUri);
        setMetadata(_metadata);
        setLoading(false);
      }
    })();
  }, [tokenUri]);

  return { metadata, loading, tokenUri };
};
