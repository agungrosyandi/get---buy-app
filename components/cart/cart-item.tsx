"use client";

import { TableBody, TableRow, TableCell, TableHeader } from "../ui/table";
import { useMemo } from "react";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";

import { createId } from "@paralleldrive/cuid2";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/zustand/client-store";
import EmptyBoxLottie from "../lottie-motion/empty-box";

export default function CartItems() {
  //  import from  zustand state management --------------------------

  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();

  //  price total logic --------------------------

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  return (
    <motion.div className="relative w-full gap-5 flex flex-col items-center justify-center">
      {/* empty chart -------------------------------------- */}

      {cart.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-2xl text-muted-foreground">Cart is empty</h1>

            <EmptyBoxLottie />
          </motion.div>
        </div>
      )}

      {/* add chart item -------------------------------------- */}

      {cart.length > 0 && (
        <div className="h-[10rem] overflow-y-auto">
          <table className="max-w-4xl mx-auto desktopMinWidth:w-[50vw]">
            <TableHeader>
              <TableRow className="text-xs">
                <TableCell>Product</TableCell>
                <TableCell>Prices</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between gap-2">
                      <MinusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() =>
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }
                        size={14}
                      />
                      <p>{item.variant.quantity}</p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() =>
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      )}

      <motion.div className="relative flex items-center justify-center overflow-hidden">
        <span className="pr-2">Total :</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, i) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* button cart submit --------------------------------------I */}

      <Button
        className="max-w-md w-full"
        onClick={() => setCheckoutProgress("payment-page")}
        disabled={cart.length === 0}
      >
        Checkout
      </Button>
    </motion.div>
  );
}
