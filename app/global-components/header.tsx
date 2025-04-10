import { auth } from "@/server/auth";
import Logo from "./header-components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import UserButton from "@/components/navigation/user-button";
import CartDrawer from "@/components/cart/cart-drawer";

export default async function Header() {
  const session = await auth();

  return (
    <section className="relative flex justify-between items-center h-[10vh]">
      <Logo />

      <div className="flex flex-row items-center gap-5">
        <CartDrawer />

        {!session ? (
          <Button asChild variant="outline">
            <Link className="flex gap-2" href={"/auth/login"}>
              <LogIn />
              <span>login</span>
            </Link>
          </Button>
        ) : (
          <UserButton expires={session?.expires} user={session?.user} />
        )}
      </div>
    </section>
  );
}
