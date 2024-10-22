"use client";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }));

    setProducts(products);
  }

  return (
    <section>
      <h2>Rediger produkter</h2>
      <ul className="flex flex-wrap gap-4">
        {products.map((product) => (
          <Link href={`/admin/products/${product.id}`} key={product.id}>
            <ProductCard product={product} admin />
          </Link>
        ))}
      </ul>
    </section>
  );
}

export default AdminProducts;
