import React from "react";
import DisplayProducts from "../../components/DisplayProducts";
import { fetchProductsByCategory } from "@/utils/fetchProducts";

export default async function Mouthpieces() {
  const mouthpieces = await fetchProductsByCategory("mouthpieces");

  return (
    <section>
      <h1>Munnstykker</h1>
      <DisplayProducts products={mouthpieces} category="munnstykker" />
    </section>
  );
}

// Enable ISR by exporting `revalidate`
export const revalidate = 60; // Revalidate every 60 seconds
