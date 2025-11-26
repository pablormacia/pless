"use client";

import { useTransition } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

      toast.success("Bienvenido!");

      // Redirección dinámica: /[slug]/admin
      router.push(`/${result.slug}/admin`);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">Iniciar sesión</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          className="w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded"
        >
          {isPending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
