"use client";

import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  value: string;
  setValue: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function EditCategoryModal({
  open,
  value,
  setValue,
  onSave,
  onClose,
}: Props) {
  return (
    <ModalBase open={open} title="Editar categoría" onClose={onClose}>
      <input
        type="text"
        className="w-full border p-2 rounded"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave}>Guardar</Button>
      </div>
    </ModalBase>
  );
}
