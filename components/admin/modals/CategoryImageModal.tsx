"use client";

import ModalBase from "./ModalBase";
import ImageUploader from "@/components/admin/ImageUploader";
import { Category } from "@/types";

type Props = {
  open: boolean;
  category: Category | null;
  businessId: string;
  onUpload: (url: string | null) => void;
  onClose: () => void;
};

export default function CategoryImageModal({
  open,
  category,
  businessId,
  onUpload,
  onClose,
}: Props) {
  if (!open || !category) return null;

  return (
    <ModalBase open={open} title="Cambiar foto de categoría" onClose={onClose}>
      <ImageUploader
        currentUrl={category.image_url}
        bucket="categories"
        folderId={category.id}
        businessId={businessId}   // 👈 AHORA VIENE DEL PROP
        onUploaded={onUpload}
      />
    </ModalBase>
  );
}
