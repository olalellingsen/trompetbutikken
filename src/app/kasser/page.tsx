import React from "react";
import { fetchProductsByCategory } from "@/utils/fetchProducts";
import DisplayProducts from "../../components/DisplayProducts";

export default async function Cases() {
  const cases = await fetchProductsByCategory("cases");

  return (
    <section>
      <h1>Kasser og bager</h1>
      <DisplayProducts products={cases} category="kasser" />
    </section>
  );
}

export const revalidate = 60;
