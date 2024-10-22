"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db, storage } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

function EditProduct({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id: productId } = params;

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  async function fetchProduct() {
    try {
      const productDoc = await getDoc(doc(db, "products", productId as string));
      if (productDoc.exists()) {
        setProduct(productDoc.data() as Product);
      } else {
        setError("Product not found");
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching product data");
      setLoading(false);
    }
  }

  async function handleImageUpload(file: File) {
    if (!file) return "";
    const storageRef = ref(storage, `products/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      // If there's a new image, upload it
      let imageUrl = product?.imageUrl || ""; // Keep existing image URL by default
      if (newImage) {
        imageUrl = await handleImageUpload(newImage);
      }

      // Update product data in Firestore
      await updateDoc(doc(db, "products", productId as string), {
        ...product, // Keep existing data
        imageUrl, // Update image URL
      });

      setSuccess("Product updated successfully");
    } catch (err) {
      setError("Failed to update product: " + (err as Error).message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <Link
        className="underline hover:no-underline text-gray-500"
        href="/admin"
      >
        Tilbake til produkter
      </Link>
      <h2>Rediger produkt</h2>
      {product && (
        <form onSubmit={handleSubmit} className="*:w-full *:my-1">
          <div className="flex flex-wrap gap-2 md:gap-4 w-full">
            <div>
              <label>Merke</label>
              <input
                type="text"
                value={product.brand}
                onChange={(e) =>
                  setProduct({ ...product, brand: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Modell</label>
              <input
                type="text"
                value={product.model}
                onChange={(e) =>
                  setProduct({ ...product, model: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Pris</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label>Antall på lager</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="grid">
            <label>Beskrivelse</label>
            <textarea
              className="h-36"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-wrap">
            <label>Last opp bilde</label>
            <input
              type="file"
              className="w-48"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewImage(e.target.files[0]);
                }
              }}
            />
          </div>
          <div>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.model}
                height={100}
                width={200}
              />
            )}
            <br />
            <button type="submit">Oppdater</button>
            <p>{success}</p>
          </div>
        </form>
      )}
    </section>
  );
}

export default EditProduct;
