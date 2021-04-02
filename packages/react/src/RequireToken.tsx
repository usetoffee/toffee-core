import { RequireTokenProps, TokenSource } from "index";
import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "src";
import { getErc721Contract } from "./ERC721Contract";
import { accountMatch } from "./util";

export const useRequireToken = (source: TokenSource | TokenSource[]) => {
  const { provider, address } = useContext(WalletContext);

  const [hasToken, setHasToken] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    async () => {
      if (address && provider) {
        try {
          const _hasToken = await checkWalletBySources(
            address,
            source,
            provider
          );
          setHasToken(_hasToken);
        } catch (e) {
          setError(e);
        }
      }
      setChecking(false);
    };
  }, [provider, address]);

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
  const { checking, error, hasToken } = useRequireToken(source);

  if (checking) {
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

export const checkWalletBySources = async (
  address: string,
  sources: TokenSource | TokenSource[],
  provider: any
) => {
  let sourcesArray = Array.isArray(sources) ? sources : [sources];
  const promises = sourcesArray.map((source) =>
    checkWalletBySource(address, source, provider)
  );
  const results = await Promise.all(promises);
  return results.some((result) => result === true);
};

export const checkWalletBySource = async (
  address: string,
  source: TokenSource,
  provider: any
) => {
  const erc721 = getErc721Contract(source.contract, provider);
  const ownerOf = await erc721.functions.ownerOf(source.tokenId);
  return accountMatch(ownerOf, address);
};
