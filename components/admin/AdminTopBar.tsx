"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useParams } from "next/navigation";

export default function AdminTopBar() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const slug = params.slug as string;

  return (
    <>
      <header className="w-full h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-50">
        <h1 className="font-semibold text-lg">Panel</h1>

        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      <AdminSidebar open={open} setOpen={setOpen} slug={slug} />
    </>
  );
}
