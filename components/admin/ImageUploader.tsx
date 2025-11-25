"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
    currentUrl: string | null;
    bucket: string;
    folderId: number | string;
    businessId: string;
    onUploaded: (newUrl: string | null) => void;
};

export default function ImageUploader({
    currentUrl,
    bucket,
    folderId,
    businessId,
    onUploaded
}: Props) {
    const [uploading, setUploading] = useState(false);

    const getInternalPath = (url?: string | null) => {
        if (!url) return null;

        // Intentar obtener la parte después de .../object/public/businesses/
        const marker = "/object/public/businesses/";
        const idx = url.indexOf(marker);
        if (idx !== -1) {
            return url.substring(idx + marker.length);
        }

        // Si la URL es ya una ruta interna por algún motivo, devolvela
        // (ej: "123/products/8/imagen.webp")
        if (!url.startsWith("http") && url.includes("/")) return url;


        return null;
    };

    const deleteOldImage = async () => {
        if (!currentUrl) return;

        const path = getInternalPath(currentUrl);
        if (!path) return;

        const { error } = await supabase.storage
            .from("businesses")
            .remove([path]);

        if (error) {
            console.log("Error deleting old image:", error);
            throw error;
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // Convertir a webp y comprimir
        const webpFile = await convertToWebP(file);

        // Eliminar imagen anterior (si existe)
        await deleteOldImage();

        const fileName = `${Date.now()}.webp`;
        let filePath = "";

        // CATEGORÍAS — carpeta sin businessId
        if (bucket === "categories") {
            filePath = `${businessId}/categories/${folderId}/${fileName}`;
        }
        // PRODUCTOS — carpeta con businessId (como ya funciona)
        else if (bucket === "products") {
            filePath = `${businessId}/products/${folderId}/${fileName}`;
        }
        // Cualquier otro bucket opcional
        else {
            filePath = `${businessId}/${bucket}/${folderId}/${fileName}`;
        }


        const { error } = await supabase.storage
            .from("businesses")
            .upload(filePath, webpFile, {
                cacheControl: "3600",
                upsert: true
            });

        if (error) {
            console.log(error);
            toast.error("Error al subir imagen");
            setUploading(false);
            return;
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${filePath}`;

        onUploaded(publicUrl);

        toast.success("Imagen actualizada");
        setUploading(false);
    };

    const handleDeleteClick = async () => {
        if (!confirm("¿Eliminar imagen? Esta acción no se puede deshacer.")) return;
        await handleDelete();
    };

    // ELIMINAR la imagen desde el botón en el modal
    const handleDelete = async () => {
        if (!currentUrl) return;

        const path = getInternalPath(currentUrl);
        console.log(path)
        if (!path) return;

        setUploading(true);

        const { error } = await supabase.storage
            .from("businesses")
            .remove([path]);

        if (error) {
            toast.error("Error al eliminar la imagen");
            setUploading(false);
            return;
        }

        onUploaded(null);
        toast.success("Imagen eliminada");
        setUploading(false);
    };

    const isValidImageUrl = (url?: string | null) => {
        if (!url) return false;
        const clean = url.trim().toLowerCase();
        if (clean === "" || clean === "null" || clean === "undefined") return false;
        return true;
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <Image
                src={currentUrl || "/icons/food.svg"}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-xl object-cover aspect-square border"
            />

            <Button variant="outline" size="sm" asChild disabled={uploading}>
                <label>
                    {uploading ? "Subiendo..." : "Cambiar imagen"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
            </Button>

            {isValidImageUrl(currentUrl) && (
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={uploading}
                    onClick={handleDeleteClick}
                >
                    Eliminar imagen
                </Button>
            )}
        </div>
    );
}

// Conversión a WebP
async function convertToWebP(file: File): Promise<File> {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.7)
    );

    if (!blob) throw new Error("Error convirtiendo imagen a webp");

    return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
        type: "image/webp"
    });
}
