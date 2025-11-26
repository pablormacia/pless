export interface Product {
    id: string;
    business_id:string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    available: boolean;
}

export interface Category {
    id: string;
    name: string;
    sort_order: number;
    products: Product[];
    image_url: string | null;
}