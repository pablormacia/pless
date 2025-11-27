"use client";

import { Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminTopBar() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();

      if (data.user) {
        setEmail(data.user.email);
        setBusinessName(data.user.businessName);
      }
    }

    load();
  }, []);

  return (
    <>
      <header className="w-full h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-50">

        {/* IZQUIERDA — Icono menú + título */}
        <div className="flex items-center gap-3">
          {/* Icono menú a la izquierda */}
          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          {/* Título y nombre del negocio */}
          <div className="flex flex-col leading-tight">
            <h1 className="font-semibold text-lg">Panel</h1>

            {businessName && (
              <span className="text-xs text-slate-500 hidden sm:block">
                {businessName}
              </span>
            )}
          </div>
        </div>

        {/* DERECHA — Email + logout */}
        <div className="flex items-center gap-4">

          {/* Email (solo desktop) */}
          {email && (
            <span className="text-sm text-slate-600 hidden sm:block">
              {email}
            </span>
          )}

          {/* Logout con icono + texto */}
          <Link
            href="/logout"
            className="hidden sm:flex items-center gap-1 text-sm text-red-600 font-medium"
          >
            <LogOut size={16} />
            Salir
          </Link>
        </div>
      </header>

      <AdminSidebar open={open} setOpen={setOpen} slug={slug} />
    </>
  );
}
