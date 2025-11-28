"use client";

import { useUserStore } from "@/stores/userStore";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function AdminClientTopBar() {
  const email = useUserStore((s) => s.email);
  const businessName = useUserStore((s) => s.businessName);
  const slug = useUserStore((s) => s.slug);

  // Si no hay sesión → no mostrar nada
  if (!email || !slug) return <h1>no hay datos para mostrarr</h1>;

  return (
    <header className="w-full h-12 bg-black text-white flex items-center justify-between px-4 sticky top-0 z-50 shadow">
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold">{businessName}</span>
        <span className="text-[10px] text-gray-300">{email}</span>
      </div>

      <Link
        href={`/${slug}/admin`}
        className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded text-xs font-medium"
      >
        <LayoutDashboard size={14} />
        Ir al panel
      </Link>
    </header>
  );
}
