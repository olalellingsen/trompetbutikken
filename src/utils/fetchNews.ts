import { db } from "@/firebaseAdmin";
import { News } from "@/types";

export async function fetchNews(): Promise<News[]> {
  const productsSnapshot = await db.collection("news").get();
  return productsSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as News),
    }))
    .sort((a, b) => a.number - b.number);
}
