import React from "react";
import Image from "next/image";
import placeholder from "@/public/placeholder.png";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  admin?: boolean;
}

function ProductCard({ product, admin }: ProductCardProps) {
  return (
    <div className="group bg-stone-100 dark:bg-stone-600 flex flex-col justify-between w-full overflow-hidden rounded-md h-full shadow hover:shadow-md hover:-translate-y-0.5 transform transition duration-200">
      <Image
        src={product.imageUrl[0] || placeholder}
        alt={product.model}
        height={100}
        width={200}
        className="w-full group-hover:opacity-90 aspect-square object-cover"
      />

      <div className="p-2">
        <p className="text-gray-500 dark:text-gray-400">{product.brand}</p>
        <p>{product.model}</p>
        {new Intl.NumberFormat("nb-NO", {
          style: "currency",
          currency: "NOK",
        })
          .format(product.price)
          .replace(",00", "")}

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
        {admin && <p>Lagerstatus: {product.stock}</p>}
      </div>
    </div>
  );
}

export default ProductCard;
