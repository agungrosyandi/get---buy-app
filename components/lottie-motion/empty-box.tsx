"use client";

import emptyBoxMotion from "@/public/motion/empty cart.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function EmptyBoxLottie() {
  return (
    <Lottie className="h-[20rem]" loop={true} animationData={emptyBoxMotion} />
  );
}
