// /src/stores/cart.ts
import { create } from "zustand";

/** Tipos */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?:string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // acciones
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;

  // control del drawer
  openCart: () => void;
  closeCart: () => void;
}

/** Store */
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);

      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }

      return { items: [...state.items, item] };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clear: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
