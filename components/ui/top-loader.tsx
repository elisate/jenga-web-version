"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      showSpinner={false}
      height={4}
      color="#7c3aed"
      shadow={false}
    />
  );
} 