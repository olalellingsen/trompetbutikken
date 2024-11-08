import React from "react";
import { db } from "@/firebaseAdmin";
import DisplayProducts from "../../components/DisplayProducts";

async function Instruments() {
  const productsSnapshot = await db.collection("products").get();
  const instruments = productsSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }))
    .filter((product) => product.category === "instruments");

  return (
    <section>
      <h1>Instrumenter</h1>
      <DisplayProducts products={instruments} category="instrumenter" />
    </section>
  );
}

export default Instruments;
