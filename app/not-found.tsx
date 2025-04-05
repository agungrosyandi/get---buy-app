import NotFoundLottie from "@/components/lottie-motion/not-found-lottie";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" w-full h-full flex flex-col justify-start items-center">
      <NotFoundLottie />
      <Button variant={"outline"}>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
