"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface DisplayProductsProps {
  products: Product[];
  category?: string;
}

const DisplayProducts = ({ products, category }: DisplayProductsProps) => {
  const [showTrumpet, setShowTrumpet] = useState(true);
  const [showFlugelhorn, setShowFlugelhorn] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Sorting by brand first, then by model within each brand
  const trumpets = products
    .filter((product) => product.type === "trumpet")
    .sort(
      (a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)
    );

  const flugelhorns = products
    .filter((product) => product.type === "flugelhorn")
    .sort(
      (a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)
    );

  const trumpet_brands = Array.from(
    new Set(trumpets.map((product) => product.brand))
  );
  const flugelhorn_brands = Array.from(
    new Set(flugelhorns.map((product) => product.brand))
  );

  const handleToggle = (type: string) => {
    setShowTrumpet(type === "trumpet");
    setShowFlugelhorn(type === "flugelhorn");
    setSelectedBrands([]); // Reset selected brands when toggling between types
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  // Filter products by selected brands if any are selected
  const filteredTrumpets =
    selectedBrands.length > 0
      ? trumpets.filter((product) => selectedBrands.includes(product.brand))
      : trumpets;

  const filteredFlugelhorns =
    selectedBrands.length > 0
      ? flugelhorns.filter((product) => selectedBrands.includes(product.brand))
      : flugelhorns;

  return (
    <section>
      {/* Filter by type */}
      <div className="flex flex-wrap py-4 justify-between">
        {trumpets.length > 0 && flugelhorns.length > 0 && (
          <div>
            <button
              className={`${
                showTrumpet
                  ? "bg-blue-200 hover:bg-blue-200 dark:bg-stone-700 dark:hover:bg-stone-700"
                  : "bg-blue-100 hover:bg-blue-200 dark:bg-stone-600 dark:hover:bg-stone-700"
              }`}
              onClick={() => handleToggle("trumpet")}
            >
              Trompet
            </button>
            <button
              className={`${
                showFlugelhorn
                  ? "bg-blue-200 hover:bg-blue-200 dark:bg-stone-700 dark:hover:bg-stone-700"
                  : "bg-blue-100 hover:bg-blue-200 dark:bg-stone-600 dark:hover:bg-stone-700"
              }`}
              onClick={() => handleToggle("flugelhorn")}
            >
              Flygelhorn
            </button>
          </div>
        )}

        {/* Filter by brand */}
        <ul className="flex gap-4 p-3">
          {showTrumpet &&
            trumpet_brands.length > 1 &&
            trumpet_brands.map((brand) => (
              <li className="flex" key={brand}>
                <input
                  type="checkbox"
                  className="size-5 hover:cursor-pointer"
                  id={brand}
                  name={brand}
                  value={brand}
                  onChange={() => handleBrandChange(brand)}
                  checked={selectedBrands.includes(brand)}
                />
                <label className="font-thin" htmlFor={brand}>
                  {brand}
                </label>
              </li>
            ))}
          {showFlugelhorn &&
            flugelhorn_brands.length > 1 &&
            flugelhorn_brands.map((brand) => (
              <li className="flex" key={brand}>
                <input
                  type="checkbox"
                  className="size-5 hover:cursor-pointer"
                  id={brand}
                  name={brand}
                  value={brand}
                  onChange={() => handleBrandChange(brand)}
                  checked={selectedBrands.includes(brand)}
                />
                <label className="font-thin" htmlFor={brand}>
                  {brand}
                </label>
              </li>
            ))}
        </ul>
      </div>

      {/* Display products */}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {showTrumpet &&
          filteredTrumpets.map((product) => (
            <Link href={`/${category}/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))}
        {showFlugelhorn &&
          filteredFlugelhorns.map((product) => (
            <Link href={`/${category}/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))}
      </ul>
    </section>
  );
};

export default DisplayProducts;
