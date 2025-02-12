"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
                <label>Bilde</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
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

      <br />

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
