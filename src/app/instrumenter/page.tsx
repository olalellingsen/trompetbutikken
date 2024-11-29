import React from "react";
import DisplayProducts from "../../components/DisplayProducts";
import { fetchProductsByCategory } from "@/utils/fetchProducts";

export default async function Instruments() {
  const instruments = await fetchProductsByCategory("instruments");

  return (
    <section>
      <h1>Instrumenter</h1>
      <DisplayProducts products={instruments} category="instrumenter" />
    </section>
  );
}

// Enable ISR by exporting `revalidate`
export const revalidate = 60; // Revalidate every 60 seconds
