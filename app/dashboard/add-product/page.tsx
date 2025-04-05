import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import CreateProductForm from "./product-form";

export default async function AddProduct() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/settings");

  return <CreateProductForm />;
}
