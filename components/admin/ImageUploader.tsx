"use client";

import { useState, useEffect } from "react";
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
    const [imageLoading, setImageLoading] = useState(true);

    // Cada vez que cambia la URL, volvemos a mostrar el loader
    useEffect(() => {
        setImageLoading(true);
    }, [currentUrl]);

    const getInternalPath = (url?: string | null) => {
        if (!url) return null;

        const marker = "/object/public/businesses/";
        const idx = url.indexOf(marker);
        if (idx !== -1) {
            return url.substring(idx + marker.length);
        }

        // Si solo es un filename, construir ruta según bucket
        if (!url.startsWith("http") && url.includes(".")) {
            if (bucket === "categories") return `${businessId}/categories/${folderId}/${url}`;
            if (bucket === "products") return `${businessId}/products/${folderId}/${url}`;
        }

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

        if (bucket === "categories") {
            filePath = `${businessId}/categories/${folderId}/${fileName}`;
        } else if (bucket === "products") {
            filePath = `${businessId}/products/${folderId}/${fileName}`;
        } else {
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

    const handleDelete = async () => {
        if (!currentUrl) return;

        const path = getInternalPath(currentUrl);
        console.log(path);
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

    const hasImage = isValidImageUrl(currentUrl);
    const imageSrc = hasImage ? (currentUrl as string) : "/icons/food.svg";

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Contenedor cuadrado con fondo + loader */}
            <div className="relative w-[120px] h-[120px] rounded-xl border bg-slate-100 overflow-hidden flex items-center justify-center">
                {/* Skeleton + spinner mientras carga la imagen real */}
                {hasImage && (imageLoading || uploading) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                        <span className="text-xs text-slate-500">Cargando imagen...</span>
                    </div>
                )}

                {/* Imagen (con fade-in cuando carga) */}
                <Image
                    src={imageSrc}
                    alt="Preview"
                    fill
                    sizes="120px"
                    className={`object-cover transition-opacity duration-300 ${
                        imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoadingComplete={() => setImageLoading(false)}
                />
            </div>

            <Button variant="outline" size="sm" asChild disabled={uploading}>
                <label>
                    {uploading ? "Subiendo..." : "Cambiar imagen"}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </label>
            </Button>

            {hasImage && (
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
