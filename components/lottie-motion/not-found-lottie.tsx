"use client";

import notFound from "@/public/motion/not-found-lottie.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function NotFoundLottie() {
  return <Lottie className="h-[25rem]" loop={true} animationData={notFound} />;
}
