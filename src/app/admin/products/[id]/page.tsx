"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import Image from "next/image";
import { db, storage } from "@/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { X } from "lucide-react";

function EditProduct({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product>();
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Track image URLs separately
  const [newImages, setNewImages] = useState<File[]>([]);
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

  useEffect(() => {
    if (product?.imageUrl) {
      setImageUrls(product.imageUrl); // Initialize state when product is fetched
    }
  }, [product]);

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
      setError("Error fetching product data" + (err as Error).message);
      setLoading(false);
    }
  }

  async function handleImageUpload(files: File[]) {
    const imageUrl = [];
    for (const file of files) {
      const storageRef = ref(storage, `products/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      imageUrl.push(url);
    }
    return imageUrl;
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    try {
      // Validate and parse price and stock
      const price = parseFloat(String(product?.price || "0"));
      const stock = parseInt(String(product?.stock || "0"));

      if (isNaN(price) || isNaN(stock)) {
        throw new Error("Price and stock must be valid numbers");
      }

      // Combine existing image URLs and any newly uploaded images
      let updatedImageUrls = imageUrls; // Always use the latest state
      if (newImages.length > 0) {
        const newImageUrls = await handleImageUpload(newImages);
        updatedImageUrls = [...updatedImageUrls, ...newImageUrls];
      }

      // Update product data in Firestore
      await updateDoc(doc(db, "products", productId), {
        ...product,
        imageUrl: updatedImageUrls,
      });

      setSuccess("Product updated successfully");
      goBackToProducts();
    } catch (err) {
      setError("Failed to update product: " + (err as Error).message);
    }
  }

  async function handleDeleteImage(url: string) {
    // Optimistically remove the image from state
    const updatedImages = imageUrls.filter((img) => img !== url);
    setImageUrls(updatedImages);

    try {
      // Update Firestore to reflect the change
      await updateDoc(doc(db, "products", productId), {
        imageUrl: updatedImages,
      });
    } catch (err) {
      // If the Firestore update fails, revert the UI change
      setError("Failed to delete image: " + (err as Error).message);
      setImageUrls((prev) => [...prev, url]);
    }
  }

  async function handleDelete() {
    try {
      await deleteDoc(doc(db, "products", productId as string));
      goBackToProducts();
    } catch (err) {
      setError("Failed to delete product: " + (err as Error).message);
    }
  }

  function goBackToProducts() {
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
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
              <label>Prod ID</label>
              <input
                type="text"
                value={product.prod_id}
                onChange={(e) =>
                  setProduct({ ...product, prod_id: e.target.value })
                }
                required
              />
            </div>
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
                type="text"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Antall på lager</label>
              <input
                type="text"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
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
            {newImages.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                {newImages.map((image, idx) => (
                  <Image
                    key={idx}
                    src={URL.createObjectURL(image)}
                    alt={`New Image ${idx + 1}`}
                    width={100}
                    height={100}
                  />
                ))}
              </div>
            )}

            {/* Display existing images */}
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative w-max">
                  <Image
                    src={url}
                    alt={`Existing Image ${idx + 1}`}
                    width={100}
                    height={100}
                  />
                  {/* Delete button */}
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 p-1 rounded-full text-white"
                    onClick={() => handleDeleteImage(url)}
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <br />
            <button type="submit">Oppdater</button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setShowDialog(true)}
            >
              Slett
            </button>
            <p>{success}</p>
          </div>
        </form>
      )}

      {showDialog && (
        <dialog className="fixed top-0 right-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="max-w-sm mx-auto p-3 rounded-lg bg-background text-foreground border border-foreground ">
            <p>Er du sikker på at du vil slette dette produktet?</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                handleDelete();
                setShowDialog(false);
              }}
            >
              Ja, slett
            </button>
            <button onClick={() => setShowDialog(false)}>Nei, avbryt</button>
          </div>
        </dialog>
      )}
    </section>
  );
}

export default EditProduct;
