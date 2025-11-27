import { create } from "zustand";

type UserState = {
  email: string | null;
  businessId: string | null;
  businessName: string | null;
  slug: string | null;
  setUserData: (data: Partial<UserState>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  email: null,
  businessId: null,
  businessName: null,
  slug: null,

  setUserData: (data) => set(data),

  clearUser: () =>
    set({
      email: null,
      businessId: null,
      businessName: null,
      slug: null,
    }),
}));
