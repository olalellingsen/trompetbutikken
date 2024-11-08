"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface DisplayProductsProps {
  products: Product[];
  category: string;
}

const DisplayProducts = ({ products, category }: DisplayProductsProps) => {
  const [trumpet, setTrumpet] = useState(true);
  const [flugelhorn, setFlugelhorn] = useState(false);

  const trumpets = products.filter((product) => product.type === "trumpet");

  const flugelhorns = products.filter(
    (product) => product.type === "flugelhorn"
  );

  const handleToggle = (type: string) => {
    setTrumpet(type === "trumpet");
    setFlugelhorn(type === "flugelhorn");
  };

  return (
    <section>
      <div className="py-4">
        {trumpets.length > 0 && (
          <button
            className={`${
              trumpet
                ? "bg-blue-200 hover:bg-blue-200 dark:bg-stone-700 dark:hover:bg-stone-700"
                : "bg-blue-100 hover:bg-blue-200 dark:bg-stone-600 dark:hover:bg-stone-700"
            }`}
            onClick={() => handleToggle("trumpet")}
          >
            Trompet
          </button>
        )}
        {flugelhorns.length > 0 && (
          <button
            className={`${
              flugelhorn
                ? "bg-blue-200 hover:bg-blue-200 dark:bg-stone-700 dark:hover:bg-stone-700"
                : "bg-blue-100 hover:bg-blue-200 dark:bg-stone-600 dark:hover:bg-stone-700"
            }`}
            onClick={() => handleToggle("flugelhorn")}
          >
            Flygelhorn
          </button>
        )}
      </div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trumpet &&
          trumpets.map((product) => (
            <Link href={`/${category}/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))}
        {flugelhorn &&
          flugelhorns.map((product) => (
            <Link href={`/${category}/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))}
      </ul>
    </section>
  );
};

export default DisplayProducts;
