"use client";

import Link from "next/link";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  slug: string;
}

export function AdminSidebar({ open, setOpen, slug }: Props) {
  const pathname = usePathname();

  const links = [
    { href: `/${slug}/admin`, label: "Dashboard" },
    { href: `/${slug}/admin/productos`, label: "Productos y categorías" },
    { href: `/${slug}/admin/ajustes`, label: "Ajustes" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <VisuallyHidden><DialogTitle>Dashboard Pless</DialogTitle></VisuallyHidden>
      <SheetContent side="left" className="p-0 w-64">
        <nav className="flex flex-col py-4">
          {links.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-lg border-b ${
                  active ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <Link href="/logout" className="px-4 py-3 text-left text-red-600">Cerrar sesión</Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
