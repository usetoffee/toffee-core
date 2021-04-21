import React from "react";
import { useState } from "react";
import { TokenMetadata } from "./types";

interface TokenAssetProps {
  metadata: TokenMetadata;
  imgProps: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;
  videoProps: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >;
}

type AssetType = "image" | "video";

export const TokenAsset: React.FC<TokenAssetProps> = ({
  metadata,
  videoProps,
  imgProps,
}) => {
  const [assetType, setAssetType] = useState<AssetType>();

  let src = metadata.image;
  if (metadata.animation_url) {
    src = metadata.animation_url;
  }
  const finalSrc = src?.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");

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
