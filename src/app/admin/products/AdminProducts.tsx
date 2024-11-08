"use client";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

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
    model: "",
    brand: "",
    category: "",
    type: "",
    price: 0,
    stock: 0,
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      let imageUrl = "/placeholder.png"; // Default image URL
      if (newImage) {
        imageUrl = await handleImageUpload(newImage);
      }

      await addDoc(collection(db, "products"), {
        ...newProduct, // Add product data
        imageUrl, // Update image URL
      });

      setSuccess("Product added successfully");
    } catch (err) {
      setError("Failed to add product: " + (err as Error).message);
    }
  }

  async function handleImageUpload(file: File) {
    if (!file) return "";
    const storageRef = ref(storage, `products/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  return (
    <>
      <h2
        onClick={() => setShowAddProduct(!showAddProduct)}
        className="hover:underline hover:cursor-pointer"
      >
        Legg til produkt {!showAddProduct ? "+" : "-"}
      </h2>
      {showAddProduct && (
        <section>
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-3 gap-4 *:grid">
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
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Antall på lager</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
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
                required
              />

              <label className="my-4 p-4 hover:text-blue-600 hover:cursor-pointer w-max border border-gray-400 rounded-md border-dotted">
                Last opp bilde
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
              {newProduct.imageUrl && (
                <Image
                  src={newProduct.imageUrl}
                  alt={newProduct.model}
                  height={100}
                  width={200}
                />
              )}
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
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
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
