"use client";

import { useTransition } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      router.push(`/${result.slug}/admin`);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <Image
          src="/pless_logo.webp"
          alt="Pless logo"
          width={120}
          height={120}
          className="mb-4"
        />

        {/* Bienvenida */}
        <h1 className="text-xl font-semibold text-slate-800 mb-1 text-center">
          Bienvenid@ a Pless
        </h1>

        <p className="text-sm text-slate-500 mb-6 text-center">
          Por favor iniciá sesión para administrar tu negocio.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full">

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border border-slate-300 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            className="w-full border border-slate-300 p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-60"
          >
            {isPending ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>
      </div>
    </div>
  );
}
