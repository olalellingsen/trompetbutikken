import { fetchNews } from "@/utils/fetchNews";
import React from "react";
import Image from "next/image";
import placeholder from "@/public/placeholder.png";
import Link from "next/link";

async function News() {
  const news = await fetchNews();

  return (
    <section className="mx-auto max-w-4xl">
      {news.length != 0 && (
        <h2 className="text-center sm:text-left">Nyheter og arrangementer</h2>
      )}

      <ul className="grid gap-4">
        {news.map((news) => (
          <Link href={`/news/${news.id}`} key={news.id}>
            <li className="grid sm:grid-cols-2 group bg-stone-100 dark:bg-stone-800 justify-between w-full overflow-hidden rounded-md shadow hover:shadow-md hover:-translate-y-0.5 transform transition duration-200">
              <Image
                src={news.imageUrl || placeholder}
                alt={news.title}
                height={100}
                width={200}
                className="w-screen group-hover:opacity-90 aspect-video object-cover"
              />

              <div className="p-3">
                <h3>{news.title}</h3>
                <p>{news.content}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
}

export default News;
