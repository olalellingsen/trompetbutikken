import { db } from "@/firebaseAdmin";
import React from "react";
import Link from "next/link";
import ProductPage from "@/components/ProductPage";
import { Product } from "@/types";

async function page({ params }: { params: { id: string } }) {
  const { id: productId } = params;

  try {
    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      return <p>Product not found.</p>;
    }

    const product = { id: productDoc.id, ...(productDoc.data() as Product) };

    return (
      <section>
        <Link
          className="underline hover:no-underline text-gray-500"
          href="/kasser"
        >
          Tilbake til kasser
        </Link>
        <ProductPage product={product} />
      </section>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <p>Failed to load product details. Please try again later.</p>;
  }
}

export default page;
