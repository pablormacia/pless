"use client";

import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Pencil,
    DollarSign,
    ChevronDown,
    ChevronRight,
    MoreVertical,
    Trash,
} from "lucide-react";
import { Category, Product } from "@/types";

type CategoryCardProps = {
    category: Category;
    isOpen: boolean;
    onToggle: () => void;

    // Categoría
    onEditCategory: () => void;
    onChangeCategoryImage: () => void;
    onDeleteCategory: () => void;

    // Productos
    onEditProduct: (product: Product) => void;
    onChangeProductImage: (product: Product) => void;
    onToggleAvailable: (product: Product, value: boolean) => void;
    onChangePrice: (product: Product) => void;
    onDeleteProduct: (product: Product) => void;
    onAddProduct: (category: Category) => void;
};

export function CategoryCard({
    category,
    isOpen,
    onToggle,
    onEditCategory,
    onChangeCategoryImage,
    onDeleteCategory,
    onEditProduct,
    onChangeProductImage,
    onToggleAvailable,
    onChangePrice,
    onDeleteProduct,
    onAddProduct
}: CategoryCardProps) {
    return (
        <div className="border rounded-lg bg-white shadow-sm">
            {/* HEADER */}
            <div className="w-full flex items-center justify-between p-3 gap-3">
                {/* Bloque clickeable */}

                <button
                    onClick={onToggle}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    <Image
                        src={category.image_url ?? "/icons/food.svg"}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover border aspect-square"
                        alt={category.name}
                    />

                    <h3 className="text-lg font-semibold">{category.name}</h3>

                    <div className="ml-auto">
                        {isOpen ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </div>
                </button>

                {/* Acciones categoría */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-md hover:bg-gray-100">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={onEditCategory}>
                            Editar nombre
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={onChangeCategoryImage}>
                            Cambiar foto
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={onDeleteCategory}
                        >
                            Eliminar categoría
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* CONTENIDO EXPANDIBLE */}
            {isOpen && (
                <div className="p-3 space-y-3 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddProduct(category)}
                    >
                        + Agregar producto
                    </Button>
                    {category.products.map((product) => (
                        <div
                            key={product.id}
                            className="p-3 bg-gray-50 rounded-lg shadow-sm flex gap-3 items-center"
                        >
                            {/* Imagen producto */}
                            <Image
                                onClick={() => onChangeProductImage(product)}
                                src={product.image_url ?? "/icons/food.svg"}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover border aspect-square cursor-pointer"
                                alt={product.name}
                            />

                            <div className="flex-1">
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-600">${product.price}</p>

                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs">Disponible:</span>
                                    <Switch
                                        checked={product.available}
                                        onCheckedChange={(v) =>
                                            onToggleAvailable(product, !!v)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEditProduct(product)}
                                >
                                    <Pencil size={18} />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onChangePrice(product)}
                                >
                                    <DollarSign size={18} />
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => onDeleteProduct(product)}
                                >
                                    <Trash size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
