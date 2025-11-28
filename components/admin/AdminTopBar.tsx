"use client";

import { Menu, LogOut,Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";

export default function AdminTopBar() {
  const [open, setOpen] = useState(false);
  const email = useUserStore((state) => state.email);
  const businessName = useUserStore((state) => state.businessName);

  const setUserData = useUserStore((state) => state.setUserData);

  const slug = useUserStore((s) => s.slug);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();

      if (data.user) {
        setUserData({
          email: data.user.email,
          businessId: data.user.businessId,
          businessName: data.user.businessName,
          slug: data.user.slug,
        });
      }
    }

    load();
  }, []);


  return (
    <>
      <header className="w-full h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-50">

        {/* IZQUIERDA — Icono menú + título */}
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="flex flex-col leading-tight">
            <h1 className="font-semibold text-lg">Panel</h1>

            {/* Nombre del negocio — visible solo en desktop */}
            {businessName && (
              <span className="text-xs text-slate-500 hidden sm:block">
                {businessName}
              </span>
            )}
          </div>
        </div>

        {/* DERECHA — info usuario + logout */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center sm:gap-4 leading-tight text-right">

          {/* MOBILE: negocio + email juntos */}
          {businessName && email && (
            <div className="flex flex-col text-[10px] text-slate-500 sm:hidden">
              <span>{businessName}</span>
              <span>{email}</span>
            </div>
          )}

          {/* DESKTOP: email solo */}
          {email && (
            <span className="text-sm text-slate-600 hidden sm:block">
              {email}
            </span>
          )}

          {slug && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-sm text-blue-600 font-medium"
            >
              <Globe size={16} />
              Ir al sitio
            </Link>
          )}


          {/* DESKTOP: botón salir */}
          <Link
            href="/logout"
            className="hidden sm:flex items-center gap-1 text-sm text-red-600 font-medium"
          >
            <LogOut size={16} />
            Salir
          </Link>
        </div>
      </header>

      <AdminSidebar open={open} setOpen={setOpen} />
    </>
  );
}
