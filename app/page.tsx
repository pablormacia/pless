"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gray-50 text-center">
      
      {/* LOGO */}
      <div className="mb-6">
        <Image 
          src="/pless_logo.webp" 
          alt="Pless logo" 
          width={120} 
          height={120}
          className="rounded-xl"
        />
      </div>

      {/* TITLES */}
      <h1 className="text-4xl font-bold mb-2">Pless</h1>
      <p className="text-xl text-gray-600 mb-6">Pedidos sin complicaciones</p>

      <p className="max-w-md text-gray-500 mb-10">
        La forma más simple para que tus clientes realicen pedidos desde su
        celular. Ideal para pizzerías, casas de comida, food trucks y pequeños comercios.
      </p>

      {/* BUTTONS */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/pless-demo">
          <Button className="w-full py-6 text-lg">Probar demo</Button>
        </Link>

        <Link href="/pless-demo/admin">
          <Button variant="outline" className="w-full py-6 text-lg">
            Probar panel admin
          </Button>
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} Pless — Soluciones simples para pedidos online
      </footer>
    </main>
  );
}
