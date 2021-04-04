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

  const message = `
    Prove you own:

    ${JSON.stringify(source, null, 2)}
  `;

  const { request, approved, signing, signed } = useRequireSignature(message);

  if (!provider || !account) {
    return (
      <div>
        <button onClick={connect}>connect</button>
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
        has token, but can he <button onClick={request}>sign</button>
      </div>
    );
  } else {
    return <div>"how did i get here"</div>;
  }
};
