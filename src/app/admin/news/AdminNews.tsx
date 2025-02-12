"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { News } from "@/types";

function AdminNews() {
  const [news, setNews] = useState<News[]>([]);
  const [showAddNews, setShowAddNews] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newNews, setNewNews] = useState<News>({
    title: "",
    content: "",
    imageUrl: "",
    number: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    const newsSnapshot = await getDocs(collection(db, "news"));
    const newsData = newsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as News),
    }));

    setNews(newsData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let imageUrl = newNews.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingNews?.id) {
        // Update existing news
        await updateDoc(doc(db, "news", editingNews.id), {
          ...newNews,
          imageUrl,
        });

        setSuccess("News updated successfully.");
      } else {
        // Add new news
        await addDoc(collection(db, "news"), {
          ...newNews,
          imageUrl,
        });
        setSuccess("News added successfully.");
      }

      setNewNews({ title: "", content: "", imageUrl: "", number: "" });
      setImageFile(null);
      setShowAddNews(false);
      setEditingNews(null);
      fetchNews();
    } catch (err) {
      setError("Failed to save news: " + (err as Error).message);
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `news/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async function handleDeleteImage() {
    if (!editingNews || !editingNews.imageUrl) return;

    try {
      setSuccess("");
      setError("");

      // Extract only the file name from the full URL
      const decodedUrl = decodeURIComponent(editingNews.imageUrl);
      const imagePathParts = decodedUrl.split("/o/")[1]?.split("?")[0];

      if (!imagePathParts) {
        setError("Failed to extract image path.");
        return;
      }

      const imageRef = ref(storage, imagePathParts);

      // Wait for Firebase Storage to delete the image
      await deleteObject(imageRef);

      // Wait for Firestore to update the document (removing imageUrl)
      if (editingNews?.id) {
        await updateDoc(doc(db, "news", editingNews.id), {
          imageUrl: "",
        });
      }

      // Ensure state updates AFTER deletion is confirmed
      setEditingNews((prev) => prev && { ...prev, imageUrl: "" });
      setNewNews((prev) => ({ ...prev, imageUrl: "" }));

      // Update list of news articles
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.id === editingNews.id ? { ...item, imageUrl: "" } : item
        )
      );

      setSuccess("Image deleted successfully.");
    } catch (err) {
      setError("Failed to delete image: " + (err as Error).message);
    }
  }

  function handleEdit(newsItem: News) {
    setEditingNews(newsItem);
    setNewNews(newsItem);
    setShowAddNews(true);
  }

  return (
    <section className="p-4">
      <button onClick={() => setShowAddNews(!showAddNews)}>
        {showAddNews ? "Avbryt" : "Legg til nyhet"}
      </button>

      {showAddNews && (
        <section className="my-2">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <input
                type="text"
                value={newNews.title}
                placeholder="Tittel"
                onChange={(e) =>
                  setNewNews({ ...newNews, title: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Innhold"
                value={newNews.content}
                onChange={(e) =>
                  setNewNews({ ...newNews, content: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Nummer"
                value={newNews.number}
                onChange={(e) =>
                  setNewNews({ ...newNews, number: e.target.value })
                }
                required
              />

              <div>
                <p className="font-bold">Last opp bilde</p>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              {newNews.imageUrl && (
                <div>
                  <img
                    src={newNews.imageUrl}
                    alt={newNews.title}
                    className="w-60"
                  />
                  <button
                    onClick={handleDeleteImage}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Slett bilde
                  </button>
                </div>
              )}
            </div>

            <div>
              <button type="submit">
                {editingNews ? "Oppdater" : "Legg til"}
              </button>
              <p>{success}</p>
              {error && <p>{error}</p>}
            </div>
          </form>
        </section>
      )}

      <section>
        <ul className="grid gap-4">
          {news.map((newsItem) => (
            <li key={newsItem.id} className="border p-4 rounded-md shadow-sm">
              <h3>{newsItem.title}</h3>
              <p>{newsItem.content}</p>
              {newsItem.imageUrl && (
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="w-40"
                />
              )}
              <button onClick={() => handleEdit(newsItem)}>Rediger</button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default AdminNews;
