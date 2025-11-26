"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  width?: string;
};

export default function ModalBase({
  open,
  title,
  children,
  onClose,
  width = "w-96",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className={`bg-white p-5 rounded-xl shadow space-y-4 ${width}`}>
        <h3 className="text-lg font-semibold">{title}</h3>

        {children}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
