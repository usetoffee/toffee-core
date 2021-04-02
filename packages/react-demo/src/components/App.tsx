import { WalletProvider } from "@usetoffee/react";
import { TokenCheck } from "./TokenCheck";

export const App = () => {
  const tokenSource = {
    contract: "0x61d31d57476c1acf6a81c6eacc3644735a704eb9",
    tokenId: 2,
  };
  return (
    <WalletProvider>
      <div style={{ paddingTop: "20%", paddingLeft: "20%" }}>
        <div style={{ marginBottom: "10%" }}>
          <strong>Token Source:</strong>
          <pre>{JSON.stringify(tokenSource, null, 2)}</pre>
        </div>
        <TokenCheck source={tokenSource} />
      </div>
    </WalletProvider>
  );
};
