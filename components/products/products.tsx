import formatPrice from "@/lib/format-price";
import { VariantsWithProduct } from "@/lib/infer-type";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

type ProductType = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: ProductType) {
  return (
    <main className="grid grid-cols-1 tabletMinWidth:grid-cols-2 desktopMinWidth:grid-cols-3 gap-3">
      {variants.map((variant) => (
        <Link
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.products.price}&title=${variant.products.title}&type=${variant.productType}&image=${variant.imagesVariant[0].url}`}
        >
          <Image
            className="rounded-md"
            src={variant.imagesVariant[0].url}
            width={720}
            height={480}
            alt={variant.products.title}
            loading="lazy"
          />

          <div className="flex justify-between">
            <div>
              <h2>{variant.products.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.products.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
