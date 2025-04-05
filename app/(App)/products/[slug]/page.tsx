import AddCart from "@/components/cart/add-cart";
import ProductsPick from "@/components/products/products-pick";
import ProductsShowcase from "@/components/products/products-showcase";
import ProductsType from "@/components/products/products-type";
import Reviews from "@/components/reviews/reviews";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { db } from "@/server/drizzle";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

// static params https ----------------------------------------

export async function generateStaticParams() {
  // find data in database ----------------------------------------------

  const data = await db.query.productVariants.findMany({
    with: {
      imagesVariant: true,
      tagsVariant: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (!data) return [];

  if (data) return data.map((variant) => ({ slug: variant.id.toString() }));

  return;
}

// variant main page --------------------------------------------------------------

export default async function page({ params }: { params: { slug: string } }) {
  // find variant in database -------------------------------

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      products: {
        with: {
          productVariants: {
            with: { imagesVariant: true, tagsVariant: true },
          },
        },
      },
    },
  });

  // condition if variant exist ----------------------------------------------

  if (variant) {
    return (
      <main>
        <section className="flex flex-col gap-5 desktopMinWidth:flex-row desktopMinWidth:gap-10">
          {/* variant image ------------------------ */}

          <div className="flex-1">
            <ProductsShowcase variants={variant.products.productVariants} />
          </div>

          {/* variant title ------------------------ */}

          <div className="flex-1 flex gap-2 flex-col ">
            <h2 className="text-2xl font-bold"> {variant?.products.title}</h2>
            <div className="text-base">
              <ProductsType variants={variant?.products.productVariants} />
            </div>

            <Separator />

            {/* variant price ------------------------ */}

            <p className="text-xl font-bold py-3">
              {formatPrice(variant.products.price)}
            </p>

            {/* variant description ------------------------ */}

            <div
              className="flex flex-col gap-2 text-base"
              dangerouslySetInnerHTML={{ __html: variant.products.description }}
            />

            {/* variant color ------------------------ */}

            <p className="text-secondary-foreground py-3 font-bold">
              Available Color
            </p>

            {/* onClick variant color ------------------------ */}

            <div className="flex gap-4">
              {variant.products.productVariants.map((prodVariant) => (
                <ProductsPick
                  key={prodVariant.id}
                  productID={variant.productID}
                  productType={prodVariant.productType}
                  id={prodVariant.id}
                  color={prodVariant.color}
                  price={variant.products.price}
                  title={variant.products.title}
                  image={prodVariant.imagesVariant[0].url}
                />
              ))}
            </div>

            {/* cart item add or decrease ------------------------ */}

            <AddCart />
          </div>
        </section>

        {/* review variant  ------------------------ */}

        <Reviews productID={variant.productID} />
      </main>
    );
  }
}
