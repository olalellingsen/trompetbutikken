import React from "react";
import { db } from "@/firebaseAdmin";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

async function Products() {
  const productsSnapshot = await db.collection("products").get();
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Product),
  }));

  return (
    <section>
      <h1>Produkter</h1>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link href={`/produkter/${product.id}`} key={product.id}>
            <ProductCard product={product} />
          </Link>
        ))}
      </ul>
    </section>
  );
}

export default Products;
