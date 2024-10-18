import React from "react";
import { db } from "@/firebaseAdmin";
import Image from "next/image";

async function Products() {
  const productsSnapshot = await db.collection("products").get();
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Product),
  }));

  return (
    <section>
      <h1>Produkter</h1>
      <ul className="flex flex-wrap">
        {products.map((product) => (
          <li key={product.id} className="bg-white p-4 m-2 w-72">
            {/* <Image src={product.image_url} alt={product.model} fill /> */}
            <p className="font-bold">{product.brand}</p>
            <p>{product.model}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Products;
