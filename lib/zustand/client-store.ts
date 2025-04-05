import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Variant = {
  variantID: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  //  cart item list store with array[] --------------------------------------

  cart: CartItem[];

  // add cart item list --------------------------------------

  addToCart: (item: CartItem) => void;

  // delete cart item list --------------------------------------

  removeFromCart: (item: CartItem) => void;

  //  checkout progress can have 3 variable --------------------------------------

  chekoutProgress: "cart-page" | "payment-page" | "confirmation-page";
  setCheckoutProgress: (
    val: "cart-page" | "payment-page" | "confirmation-page"
  ) => void;
};

// cart storage with cookie using persist from zustand middleware --------------------------------

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      // cart item with array --------------------------------------

      cart: [],

      // checkout progress --------------------------------------

      chekoutProgress: "cart-page",
      setCheckoutProgress: (val) => set(() => ({ chekoutProgress: val })),

      //   add cart item ----------------------------------------

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantID === item.variant.variantID
          );

          if (existingItem) {
            const updateCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantID === item.variant.variantID) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                };
              }

              return cartItem;
            });

            return { cart: updateCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            };
          }
        }),

      //   remove cart item ----------------------------------------

      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantID === item.variant.variantID) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          };
        }),
    }),
    { name: "cart-storage" }
  )
);
