// utils/fetchProducts.ts
import { db } from "@/firebaseAdmin";
import { Product } from "@/types";

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const productsSnapshot = await db.collection("products").get();
  return productsSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }))
    .filter((product) => product.category === category);
}
