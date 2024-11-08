import React from "react";
import { db } from "@/firebaseAdmin";
import DisplayProducts from "../../components/DisplayProducts";

async function Mouthpieces() {
  const productsSnapshot = await db.collection("products").get();
  const mouthpieces = productsSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }))
    .filter((product) => product.category === "mouthpieces");

  return (
    <section>
      <h1>Munnstykker</h1>
      <DisplayProducts products={mouthpieces} category="munnstykker" />
    </section>
  );
}

export default Mouthpieces;
