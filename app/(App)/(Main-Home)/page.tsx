import MainHome from "@/components/home/main-home";
import Products from "@/components/products/products";
import { db } from "@/server/drizzle";

export const revalidate = 5;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      imagesVariant: true,
      tagsVariant: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  return (
    <>
      <MainHome />
      <Products variants={data} />
    </>
  );
}
