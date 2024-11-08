"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db, storage } from "@/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

function EditProduct({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id: productId } = params;

  const [showDialog, setShowDialog] = useState(false);

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

  async function handleDelete() {
    try {
      await deleteDoc(doc(db, "products", productId as string));
    } catch (err) {
      setError("Failed to delete product: " + (err as Error).message);
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
        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-3 gap-4 *:grid">
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
              <label>Kategori</label>
              <select
                name="category"
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
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
                value={product.type}
                onChange={(e) =>
                  setProduct({ ...product, type: e.target.value })
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
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
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

            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.model}
                height={100}
                width={200}
              />
            )}
          </div>
          <div>
            <br />
            <button type="submit">Oppdater</button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setShowDialog(true)}
            >
              Slett
            </button>
            <p>{success}</p>
          </div>
        </form>
      )}

      <dialog
        open={showDialog}
        className="p-2 rounded-lg bg-background text-foreground border border-foreground "
      >
        <p>Er du sikker på at du vil slette dette produktet?</p>
        <button onClick={handleDelete}>Ja, slett</button>
        <button onClick={() => setShowDialog(false)}>Nei, avbryt</button>
      </dialog>
    </section>
  );
}

export default EditProduct;
