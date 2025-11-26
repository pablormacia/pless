"use client";

import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  categoryName: string;
  confirmValue: string;
  setConfirmValue: (v: string) => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function DeleteCategoryModal({
  open,
  categoryName,
  confirmValue,
  setConfirmValue,
  onDelete,
  onClose,
}: Props) {
  return (
    <ModalBase open={open} title="Eliminar categoría" onClose={onClose}>
      <p>
        Esto eliminará <b>{categoryName}</b> y todos sus productos.
        Escribí <b>Confirmar</b> para continuar.
      </p>

      <input
        className="w-full border p-2 rounded"
        placeholder="Confirmar"
        value={confirmValue}
        onChange={(e) => setConfirmValue(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          disabled={confirmValue !== "Confirmar"}
          onClick={onDelete}
        >
          Eliminar
        </Button>
      </div>
    </ModalBase>
  );
}
