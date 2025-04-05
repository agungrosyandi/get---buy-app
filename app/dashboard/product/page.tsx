import { db } from "@/server/drizzle";
import placehoderImage from "@/public/img/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Product() {
  // fetch and find product prom database ----------------------------

  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { imagesVariant: true, tagsVariant: true } },
    },

    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("no products found");

  // default variant or before create & add variant ----------------------

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placehoderImage.src,
        variants: [],
      };
    }

    // add and create variant including title, tags and add immages ----------------------

    const image = product.productVariants[0].imagesVariant[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });

  if (!dataTable) throw new Error("No data found !");

  return <DataTable columns={columns} data={dataTable} />;
}
