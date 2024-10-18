"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <nav className="min-h-16">
      <Menu
        size="48"
        strokeWidth={0.5}
        onClick={() => setIsOpen(true)}
        className="absolute right-2 top-2 sm:hidden"
      />

      {isOpen && (
        <div className="sm:hidden absolute right-0 top-0 bg-foreground text-background h-screen w-screen p-2 text-3xl">
          <X
            size="48"
            strokeWidth={0.5}
            onClick={() => setIsOpen(false)}
            className="absolute right-2"
          />
          <ul className="p-10 *:p-1">
            <li>
              <Link onClick={() => setIsOpen(false)} href="/">
                Hjem
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsOpen(false)} href="/produkter">
                Produkter
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsOpen(false)} href="/arrangementer">
                Arrangementer
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsOpen(false)} href="/artister">
                Artister
              </Link>
            </li>
          </ul>
        </div>
      )}
      <ul className="hidden sm:flex justify-center space-x-8 p-4 hover:*:text-gray-400">
        <li>
          <Link href="/">Hjem</Link>
        </li>
        <li>
          <Link href="/products">Produkter</Link>
        </li>
        <li>
          <Link href="/artists">Arrangementer</Link>
        </li>
        <li>
          <Link href="/artists">Artister</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
