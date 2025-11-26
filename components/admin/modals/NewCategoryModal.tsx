"use client";

import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  value: string;
  setValue: (v: string) => void;
  onCreate: () => void;
  onClose: () => void;
};

export default function NewCategoryModal({
  open,
  value,
  setValue,
  onCreate,
  onClose,
}: Props) {
  return (
    <ModalBase open={open} title="Nueva categoría" onClose={onClose}>
      <input
        className="w-full border p-2 rounded"
        placeholder="Nombre"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onCreate}>Crear</Button>
      </div>
    </ModalBase>
  );
}
