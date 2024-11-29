import React from "react";
import { db } from "@/firebaseAdmin";
import DisplayProducts from "../../components/DisplayProducts";
import { Product } from "@/types";

// Static function to fetch products
async function fetchInstruments() {
  const productsSnapshot = await db.collection("products").get();
  return productsSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }))
    .filter((product) => product.category === "instruments");
}

export default async function Instruments() {
  const instruments = await fetchInstruments();

  return (
    <section>
      <h1>Instrumenter</h1>
      <DisplayProducts products={instruments} category="instrumenter" />
    </section>
  );
}

// Enable ISR by exporting `revalidate`
export const revalidate = 60; // Revalidate every 60 seconds
