"use client";

import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

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

  const [newProduct, setNewProduct] = useState({
    prod_id: "",
    model: "",
    brand: "",
    category: "instruments",
    type: "trumpet",
    price: "",
    stock: "",
    description: "",
    imageUrl: [] as string[],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]); // Handle multiple images

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(""); // Clear previous error
    setSuccess(""); // Clear previous success message
    try {
      // Validate and parse price and stock
      const price = parseFloat(String(newProduct?.price || "0"));
      const stock = parseInt(String(newProduct?.stock || "0"));

      if (isNaN(price) || isNaN(stock)) {
        throw new Error("Price and stock must be valid numbers");
      }

      // Check for duplicate product_id
      const productRef = collection(db, "products");
      const querySnapshot = await getDocs(
        query(productRef, where("prod_id", "==", newProduct.prod_id))
      );

      if (!querySnapshot.empty) {
        setError("A product with this ID already exists.");
        return;
      }

      // Upload images
      let imageUrls: string[] = [];
      if (newImages.length > 0) {
        imageUrls = await handleMultipleImageUpload(newImages);
      }

      // Add product to Firestore
      await addDoc(productRef, {
        ...newProduct,
        imageUrls,
      });

      setSuccess("Product added successfully.");
      setNewProduct({
        prod_id: "",
        model: "",
        brand: "",
        category: "instruments",
        type: "trumpet",
        price: "",
        stock: "",
        description: "",
        imageUrl: [],
      });
      setNewImages([]);
      fetchProducts(); // Refresh product list
    } catch (err) {
      setError("Failed to add product: " + (err as Error).message);
    }
  }

  async function handleMultipleImageUpload(files: File[]) {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `products/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    // Wait for all images to upload and return URLs
    return Promise.all(uploadPromises);
  }

  return (
    <>
      <button onClick={() => setShowAddProduct(!showAddProduct)}>
        Legg til produkt {!showAddProduct ? "+" : "-"}
      </button>
      {showAddProduct && (
        <section className="my-2">
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-3 gap-4 *:grid">
              <div>
                <label>Prod ID</label>
                <input
                  type="text"
                  value={newProduct.prod_id}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, prod_id: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Merke</label>
                <input
                  type="text"
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Modell</label>
                <input
                  type="text"
                  value={newProduct.model}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, model: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Kategori</label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option value="instruments">Instrument</option>
                  <option value="mouthpieces">Munnstykker</option>
                  <option value="cases">Kasser</option>
                </select>
              </div>
              <div>
                <label>Type</label>
                <select
                  name="type"
                  value={newProduct.type}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, type: e.target.value })
                  }
                >
                  <option value="trumpet">Trompet</option>
                  <option value="flugelhorn">Flygelhorn</option>
                </select>
              </div>
              <div>
                <label>Pris</label>
                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Antall på lager</label>
                <input
                  type="text"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid">
              <label>Beskrivelse</label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />

              <label className="my-4 p-4 hover:text-blue-600 hover:cursor-pointer w-max border border-gray-400 rounded-md border-dotted">
                Last opp bilder
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setNewImages(Array.from(e.target.files));
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <br />
              <button type="submit">Legg til</button>
              <button onClick={() => setShowAddProduct(false)}>Avbryt</button>
              <p>{success}</p>
              {error && <p>{error}</p>}
            </div>
          </form>
        </section>
      )}

      <br />

      <section>
        <h2>Rediger produkter</h2>
        <h3>Instrumenter</h3>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((product) => product.category === "instruments")
            .map((product) => (
              <Link href={`/admin/products/${product.id}`} key={product.id}>
                <ProductCard product={product} admin />
              </Link>
            ))}
        </ul>
        <br />
        <h3>Munnstykker</h3>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((product) => product.category === "mouthpieces")
            .map((product) => (
              <Link href={`/admin/products/${product.id}`} key={product.id}>
                <ProductCard product={product} admin />
              </Link>
            ))}
        </ul>
        <br />
        <h3>Kasser</h3>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((product) => product.category === "cases")
            .map((product) => (
              <Link href={`/admin/products/${product.id}`} key={product.id}>
                <ProductCard product={product} admin />
              </Link>
            ))}
        </ul>
      </section>
    </>
  );
}

export default AdminProducts;
