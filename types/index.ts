export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string;
    available: boolean;
}

export interface Category {
    id: number;
    name: string;
    sort_order: number;
    products: Product[];
    image_url: string;
}