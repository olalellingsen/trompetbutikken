"use client";
import React, { useEffect, useState } from "react";
import EditProducts from "./EditProducts";
import { app } from "../../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

function Admin() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

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
    } catch (error: string | any) {
      setError("Failed to log in: " + error.message);
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
          <p className="my-2">Logget inn som {user.email}</p>
          <button onClick={handleLogout}>Logg ut</button>
        </div>
        <br />

        <EditProducts />
      </section>
    );
  } else {
    return (
      <form onSubmit={handleLogin}>
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
    );
  }
}

export default Admin;
