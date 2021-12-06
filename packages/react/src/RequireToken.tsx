import React, { useContext, useEffect, useState } from "react";
import { RequireTokenProps, TokenSource } from "./types";
import { WalletContext } from "./WalletContext";
import { getErc721Contract } from "./ERC721";
import { accountMatch } from "./util";
import { getErc1155Contract } from "./ERC1155";

export const useRequireToken = (source: TokenSource | TokenSource[]) => {
  const { provider, account, chainId } = useContext(WalletContext);

  const [hasToken, setHasToken] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      setChecking(true);
      if (account && provider) {
        try {
          const _hasToken = await checkTokenBySources(
            account,
            source,
            provider
          );
          setHasToken(_hasToken);
        } catch (e) {
          const _erorr: any = e;
          setError(_erorr);
        }
        setChecking(false);
      }
      if (!account && !provider) {
        setChecking(false);
      }
    })();
  }, [provider, account, chainId]);

  return { hasToken, checking, error };
};

export const RequireToken: React.FC<RequireTokenProps> = ({
  source,
  render,
  renderError,
  renderChecking,
  renderConnect,
  renderUnauthorized,
}) => {
  const { provider, account } = useContext(WalletContext);
  const { checking, error, hasToken } = useRequireToken(source);

  if (!provider || !account) {
    return renderConnect();
  } else if (checking) {
    return renderChecking();
  } else if (error) {
    return renderError(error);
  } else if (hasToken) {
    return render();
  } else if (!checking && !hasToken) {
    return renderUnauthorized();
  } else {
    return renderConnect();
  }
};

export const checkTokenBySources = async (
  account: string,
  sources: TokenSource | TokenSource[],
  provider: any
) => {
  let sourcesArray = Array.isArray(sources) ? sources : [sources];
  const promises = sourcesArray.map((source) =>
    checkTokenBySource(account, source, provider)
  );
  const results = await Promise.all(promises);
  return results.some((result) => result === true);
};

export const checkTokenBySource = async (
  account: string,
  source: TokenSource,
  provider: any
) => {
  let hasToken = false;
  try {
    const hasErc721 = await checkErc721(account, source, provider);
    hasToken = hasToken || hasErc721;
  } catch (e) {}
  try {
    const hasErc1155 = await checkErc1155(account, source, provider);
    hasToken = hasToken || hasErc1155;
  } catch (e) {}
  if (hasToken) {
    return hasToken;
  }
  return hasToken;
};

export const checkErc721 = async (
  account: string,
  source: TokenSource,
  provider: any
) => {
  let tokenIdArray = Array.isArray(source.tokenId)
    ? source.tokenId
    : [source.tokenId];
  const erc721 = getErc721Contract(source.contract, provider);
  const promises = tokenIdArray.map((tokenId) =>
    erc721.functions.ownerOf(tokenId)
  );
  const results = await Promise.all(promises);
  return results.some((ownerOf) => accountMatch(ownerOf, account));
};

export const checkErc1155 = async (
  account: string,
  source: TokenSource,
  provider: any
) => {
  let tokenIdArray = Array.isArray(source.tokenId)
    ? source.tokenId
    : [source.tokenId];
  const erc1155 = getErc1155Contract(source.contract, provider);
  const promises = tokenIdArray.map((tokenId) =>
    erc1155.functions.balanceOf(account, tokenId)
  );
  const results = await Promise.all(promises);
  return results.some((balance) => balance > 0);
};
