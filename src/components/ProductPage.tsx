import React from "react";
import ImageSlider from "./ImageSlider";
import { Product } from "@/types";

function ProductPage({ product }: { product: Product }) {
  return (
    <section>
      <div className="grid md:grid-cols-2 mt-4">
        <div className="p-2">
          <h2>{product.brand}</h2>
          <h2>{product.model}</h2>

          {product.stock > 0 ? (
            <div className="flex">
              <p>På lager</p>
              <span className="bg-green-700 rounded-full m-1.5 size-3"></span>
            </div>
          ) : (
            <div className="flex">
              <p>Ikke på lager</p>
              <span className="bg-red-700 rounded-full m-1.5 size-3"></span>
            </div>
          )}

          <div className="my-4 md:my-8 py-2 px-4 bg-stone-300 dark:bg-stone-800 w-max rounded-2xl">
            <h2>
              {new Intl.NumberFormat("nb-NO", {
                style: "currency",
                currency: "NOK",
              })
                .format(product.price)
                .replace(",00", "")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Inkl. mva</p>
          </div>

          <p className="py-4 hidden md:block">{product.description}</p>
        </div>

        <ImageSlider images={product.imageUrl} />
      </div>
      <p className="py-4 md:hidden">{product.description}</p>
    </section>
  );
}

export default ProductPage;
