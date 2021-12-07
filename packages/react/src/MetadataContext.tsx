import React, { createContext, useContext } from "react";
import { useMap } from "react-use";

import { TokenMetadata } from "src";

type MetadataCache = { [key: string]: TokenMetadata };

export interface MetadataContextProps {
  cache: MetadataCache;
  addCache: (key: string, value: TokenMetadata) => void;
}

export const MetadataContext = createContext<MetadataContextProps>({
  cache: {},
  addCache: () => {},
});

export const useMetadataContext = () => useContext(MetadataContext);

export const MetadataProvider: React.FC = (props) => {
  const [cache, { set: addCache }] = useMap<MetadataCache>({});

  const value: MetadataContextProps = { cache, addCache };
  return <MetadataContext.Provider value={value} {...props} />;
};
