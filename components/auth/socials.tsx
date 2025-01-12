"use client";

import { disableGoogleauth } from "@/app/utils/disable-googleauth";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Socials() {
  const path = usePathname();
  const hideGoogleAuth = disableGoogleauth.includes(path);

  return (
    <>
      {!hideGoogleAuth && (
        <Button
          className="w-full"
          onClick={() => signIn("google", { redirect: false, redirectTo: "/" })}
        >
          <FcGoogle />
          Login with google
        </Button>
      )}
    </>
  );
}
