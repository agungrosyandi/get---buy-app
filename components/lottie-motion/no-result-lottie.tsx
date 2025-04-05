"use client";

import noResultMotionLottie from "@/public/motion/no-result.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function NoResult() {
  return (
    <Lottie
      className="h-[15rem]"
      loop={true}
      animationData={noResultMotionLottie}
    />
  );
}
