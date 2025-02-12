"use client";
import React, { useEffect, useState } from "react";
import { app } from "@/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import AdminProducts from "./products/AdminProducts";
import AdminNews from "./news/AdminNews";

function Admin() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showEditNews, setShowEditNews] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Failed to log in: " + (error as Error).message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setEmail("");
    setPassword("");
  };

  if (user) {
    return (
      <section>
        <div className="flex flex-wrap justify-between gap-2 py-4">
          <p className="my-3">Logget inn som {user.email}</p>
          <button onClick={handleLogout}>Logg ut</button>
        </div>
        <br />

        <button
          className="bg-transparent text-2xl p-1 py-2 flex justify-between hover:bg-transparent hover:border-black dark:hover:border-gray-500 rounded-none w-full text-left border-b border-gray-300"
          onClick={() => {
            setShowEditNews(!showEditNews);
            setShowEditProduct(false);
          }}
        >
          <p>Rediger nyheter</p>
          {showEditNews ? <p>-</p> : <p>+</p>}
        </button>
        {showEditNews && <AdminNews />}
        <button
          className="bg-transparent text-2xl p-1 py-2 flex justify-between hover:bg-transparent hover:border-black dark:hover:border-gray-500 rounded-none w-full text-left border-b border-gray-300"
          onClick={() => {
            setShowEditProduct(!showEditProduct);
            setShowEditNews(false);
          }}
        >
          <p>Rediger produkter</p>
          {showEditProduct ? <p>-</p> : <p>+</p>}
        </button>
        {showEditProduct && <AdminProducts />}
      </section>
    );
  } else {
    return (
      <section>
        <h2 className="text-center">Logg inn</h2>
        <form onSubmit={handleLogin} className="grid max-w-96 mx-auto">
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Logg inn</button>
          {error && <p className="error">{error}</p>}{" "}
        </form>
      </section>
    );
  }
}

export default Admin;
