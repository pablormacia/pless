"use client";

import ModalBase from "./ModalBase";
import ImageUploader from "@/components/admin/ImageUploader";
import { Product } from "@/types";

type Props = {
  open: boolean;
  product: Product | null;
  businessId: string;
  onUpload: (url: string | null) => void;
  onClose: () => void;
};

export default function ProductImageModal({
  open,
  product,
  businessId,
  onUpload,
  onClose,
}: Props) {
  if (!open || !product) return null;

  return (
    <ModalBase open={open} title="Cambiar foto del producto" onClose={onClose}>
      <ImageUploader
        currentUrl={product.image_url}
        bucket="products"
        folderId={product.id}
        businessId={businessId}   // 👈 TAMBIÉN VIENE DEL PROP
        onUploaded={onUpload}
      />
    </ModalBase>
  );
}
