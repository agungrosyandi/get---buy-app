"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function ProductsType({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const selectedType = useSearchParams().get("type") || variants[0].productType;

  return variants.map((variant) => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          animate={{ y: 0, opacity: 1 }}
          initial={{ opacity: 0, y: 4 }}
          className="text-secondary-foreground font-medium"
        >
          {selectedType}
        </motion.div>
      );
    }
  });
}
