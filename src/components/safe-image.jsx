/* eslint-disable @next/next/no-img-element -- ALLOW */
"use client";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMzUgNDVIMzVINDVIMzVaIiBmaWxsPSIjOTRBM0I4Ii8+PHBhdGggZD0iTTU1IDQ1SDU1VjU1SDU1WiIgZmlsbD0iIzk0QTNCOCIvPjwvc3ZnPg==";

const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function SafeImage({ src, alt, className, width = 100, height = 100 }) {
  const imageSrc = isValidUrl(src) ? src : PLACEHOLDER_IMAGE;

  return (
    <img
      src={imageSrc}
      alt={alt || ""}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = PLACEHOLDER_IMAGE;
      }}
    />
  );
}
