import { db } from "@/firebaseAdmin";
import React from "react";
import Image from "next/image";
import Link from "next/link";

async function ProductDetails({ params }: { params: { id: string } }) {
  const { id: productId } = params;

  // Fetch the product details server-side
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
          href="/munnstykker"
        >
          Tilbake til munnstykker
        </Link>
        <h2>{product.brand}</h2>
        <h2>{product.model}</h2>
        <Image
          src={product.imageUrl}
          alt={product.model}
          width={300}
          height={300}
        />
        <p>{product.price.toLocaleString()},-</p>
        <p>{product.description}</p>
      </section>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <p>Failed to load product details. Please try again later.</p>;
  }
}

export default ProductDetails;
