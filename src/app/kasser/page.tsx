import React from "react";
import { db } from "@/firebaseAdmin";
import DisplayProducts from "../../components/DisplayProducts";

async function Cases() {
  const productsSnapshot = await db.collection("products").get();
  const cases = productsSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }))
    .filter((product) => product.category === "cases");

  return (
    <section>
      <h1>Kasser og bager</h1>
      <DisplayProducts products={cases} category="kasser" />
    </section>
  );
}

export default Cases;
