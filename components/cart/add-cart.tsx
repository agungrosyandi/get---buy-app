"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/zustand/client-store";

// add cart export in main page product/[slug] ----------------------------------------------

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const params = useSearchParams();

  // product cart ------------------------

  const id = Number(params.get("id"));
  const productID = Number(params.get("productID"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");

  // when case error -------------------------------------------

  if (!id || !productID || !title || !type || !price || !image) {
    toast.error("product not found");

    return redirect("/");
  }

  // when case normal without problem  -------------------------------------------

  if (id || productID || title || type || price || image) {
    return (
      <>
        <div className="relative py-5 flex flex-row items-center gap-3 justify-stretch">
          {/* add cart minus button ------------------------- */}

          <Button
            className="w-full"
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            variant={"secondary"}
          >
            <Minus size={18} strokeWidth={3} />
          </Button>

          {/* cart quantity layout ------------------------- */}

          <Button className="w-full" variant={"secondary"}>
            Quantity: {quantity}
          </Button>

          {/* add cart plus button ------------------------- */}

          <Button
            className="w-full"
            onClick={() => {
              setQuantity(quantity + 1);
            }}
            variant={"secondary"}
          >
            <Plus size={18} strokeWidth={3} />
          </Button>
        </div>

        {/* add into cart button ------------------------- */}

        <Button
          onClick={() => {
            toast.success(`Add ${title + " " + type} to your cart `);
            addToCart({
              id: productID,
              variant: { variantID: id, quantity },
              name: title + type,
              price,
              image,
            });
          }}
        >
          Add to Cart
        </Button>
      </>
    );
  }

  return;
}
