import React from "react";
import Image from "next/image";

function ProductPage({ product }: { product: Product }) {
  return (
    <section>
      <div className="grid md:grid-cols-2 mt-4">
        <div className="p-4 lg:p-12">
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
          <h2 className="py-4 md:py-10">
            {new Intl.NumberFormat("nb-NO", {
              style: "currency",
              currency: "NOK",
            })
              .format(product.price)
              .replace(",00", "")}
          </h2>
          <p className="py-4 hidden md:block">{product.description}</p>
        </div>

        <Image
          src={product.imageUrl}
          alt={product.model}
          width={300}
          height={300}
          className="w-full"
        />
      </div>
      <p className="py-4 md:hidden">{product.description}</p>
    </section>
  );
}

export default ProductPage;
