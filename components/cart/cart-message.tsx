"use client";

import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";

import { useCartStore } from "@/lib/zustand/client-store";

export default function CartMessage() {
  const { chekoutProgress } = useCartStore();

  return (
    <motion.div
      className="w-full text-center py-10"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* title ------------------------------------------------------------------ */}

      <DrawerTitle>
        {chekoutProgress === "cart-page" ? "Your Cart item" : null}

        {chekoutProgress === "payment-page" ? "Sorry, on development" : null}

        {chekoutProgress === "confirmation-page" ? "Order confirmated" : null}
      </DrawerTitle>

      {/* description ------------------------------------------------------------------ */}

      <DrawerDescription className="py-2">
        {chekoutProgress === "cart-page" ? "View and edit your bag" : null}

        {chekoutProgress === "payment-page" ? "Under Contructions" : null}

        {chekoutProgress === "confirmation-page" ? "Order confirmated" : null}
      </DrawerDescription>
    </motion.div>
  );
}
