"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo from "../public/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <nav className="min-h-16">
      <Link href="/" className="absolute top-2 left-2 md:top-4 md:left-4">
        <Image src={logo} alt="Trompetbutikken" className="w-12 md:w-16" />
      </Link>
      <Menu
        size="48"
        strokeWidth={0.5}
        onClick={() => setIsOpen(true)}
        className="absolute right-2 top-2 md:hidden"
      />

      {isOpen && (
        <div className="md:hidden absolute right-0 top-0 bg-background h-screen w-screen p-2 text-4xl">
          <X
            size="48"
            strokeWidth={0.5}
            onClick={() => setIsOpen(false)}
            className="absolute right-2"
          />
          <ul className="p-10 grid gap-2">
            <Link onClick={() => setIsOpen(false)} href="/">
              <li>Hjem</li>
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/produkter">
              <li>Produkter</li>
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/arrangementer">
              <li>Arrangementer</li>
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/artister">
              <li>Artister</li>
            </Link>
          </ul>
        </div>
      )}
      <ul className="hidden md:flex justify-end space-x-10 p-6 text-xl hover:*:text-gray-500">
        <Link href="/">Hjem</Link>
        <Link href="/produkter">Produkter</Link>
        <Link href="/arrangementer">Arrangementer</Link>
        <Link href="/artister">Artister</Link>
      </ul>
    </nav>
  );
}

export default Navbar;
