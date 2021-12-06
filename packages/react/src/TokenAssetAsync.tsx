import React from "react";
import { useState } from "react";
import { useTokenMetadata } from "./Token";
import { AssetType } from "./types";

export interface TokenAssetAsyncProps {
  contract: string;
  tokenId: string;
  imgProps?: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;
  videoProps?: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >;
  onLoading?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const TokenAssetAsync: React.FC<TokenAssetAsyncProps> = ({
  contract,
  tokenId,
  videoProps,
  imgProps,
  onLoading,
  fallback,
}) => {
  const [assetType, setAssetType] = useState<AssetType>();

  const { metadata, loading } = useTokenMetadata(contract, tokenId);

  let src = metadata?.image;
  if (metadata?.animation_url) {
    src = metadata.animation_url;
  }
  const finalSrc = src?.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");

  if (loading && onLoading) {
    return <>{onLoading}</>;
  }

  if (!loading && !finalSrc && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {(!assetType || assetType === "video") && (
        <video
          loop
          autoPlay
          onError={() => setAssetType("image")}
          {...videoProps}
        >
          <source src={finalSrc} />
        </video>
      )}
      {(!assetType || assetType === "image") && (
        <img
          src={finalSrc}
          onError={() => setAssetType("video")}
          {...imgProps}
        />
      )}
    </>
  );
};
