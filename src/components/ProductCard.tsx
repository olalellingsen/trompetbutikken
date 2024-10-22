import React from "react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  admin?: boolean;
}

function ProductCard({ product, admin }: ProductCardProps) {
  return (
    <div className="flex flex-col justify-between bg-white dark:bg-stone-800 rounded-lg shadow-md p-4 h-full hover:-translate-y-1 transform transition duration-200 hover:shadow-xl">
      <Image
        src={product.imageUrl}
        alt={product.model}
        height={100}
        width={200}
        className="w-full"
      />
      <div>
        <p className="text-gray-500">{product.brand}</p>
        <p>{product.model}</p>
        <p>{product.price},-</p>
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
