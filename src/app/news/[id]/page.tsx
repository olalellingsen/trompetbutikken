import { db } from "@/firebaseAdmin";
import React from "react";
import Link from "next/link";
import { News } from "@/types";
import Image from "next/image";

async function page({ params }: { params: { id: string } }) {
  const { id: newsId } = params;

  try {
    const newsDoc = await db.collection("news").doc(newsId).get();

    if (!newsDoc.exists) {
      return <p>Product not found.</p>;
    }

    const news = { id: newsDoc.id, ...(newsDoc.data() as News) };

    return (
      <section className="mx-auto max-w-3xl">
        <Link className="underline hover:no-underline text-gray-500" href="/">
          Tilbake
        </Link>

        <h1>{news.title}</h1>

        <Image
          className="w-full"
          src={news.imageUrl}
          alt={news.title}
          height={200}
          width={600}
        />

        <p className="p-2">{news.content}</p>
      </section>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <p>Failed to load product details. Please try again later.</p>;
  }
}

export default page;
