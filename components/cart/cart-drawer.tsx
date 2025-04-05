"use client";

import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/zustand/client-store";
import CartMessage from "./cart-message";
import CartItems from "./cart-item";
import CartPayment from "./cart-payment";

// cart drawer export in header section ----------------------------------------------

export default function CartDrawer() {
  const { cart, chekoutProgress } = useCartStore();

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-0.5 right-0 left-3 w-4 h-4 dark:bg-yellow-400  bg-primary-foreground text-xs text-black font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag size={30} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="w-[90vw] min-h-[40vh] p-10 mx-auto desktopMinWidth:w-[80vw] fullHdMinWidth:w-[70vw]">
        <DrawerTitle asChild>
          <CartMessage />
        </DrawerTitle>

        <div className="overflow-auto p-4">
          {chekoutProgress === "cart-page" && <CartItems />}
          {chekoutProgress === "payment-page" && <CartPayment />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
