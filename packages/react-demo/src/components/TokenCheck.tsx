import {
  TokenSource,
  useRequireToken,
  useRequireSignature,
  WalletContext,
} from "@usetoffee/react";
import React, { useContext } from "react";

interface TokenCheckProps {
  source: TokenSource | TokenSource[];
}

export const TokenCheck: React.FC<TokenCheckProps> = ({ source }) => {
  const { provider, account, connect } = useContext(WalletContext);
  const { checking, hasToken, error } = useRequireToken(source);
  const { request, approved, signing, signed } = useRequireSignature(" test ");

  if (!provider || !account) {
    return (
      <div>
        <a href="#" onClick={connect}>
          connect
        </a>
      </div>
    );
  } else if (checking) {
    return <div>checking for token</div>;
  } else if (signing) {
    return <div>signing in progress</div>;
  } else if (signed && approved) {
    return <div>signature approved, they do own the token</div>;
  } else if (error) {
    return <div>{`${error}`}</div>;
  } else if (!checking && !hasToken) {
    return <div>does not have token</div>;
  } else if (hasToken && signed && !approved) {
    return <div>this is awkward</div>;
  } else if (hasToken) {
    return (
      <div>
        has token, but can he{" "}
        <a href="#" onClick={request}>
          sign
        </a>
      </div>
    );
  } else {
    return <div>"how did i get here"</div>;
  }
};
