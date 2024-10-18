import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function EditProducts() {
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
      <ul className="flex flex-wrap">
        {products.map((product) => (
          <li key={product.id} className="bg-white p-4 m-2 w-72">
            {/* <Image src={product.image_url} alt={product.model} fill /> */}
            <p>ID: {product.id}</p>
            <p>Merke: {product.brand}</p>
            <p>Model: {product.model}</p>
            <p>Pris: {product.price}</p>
            <button>+</button>
            <button>-</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default EditProducts;
