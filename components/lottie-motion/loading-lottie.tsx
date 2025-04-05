"use client";

import loadingMotion from "@/public/motion/loading.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LoadingLottie() {
  return (
    <Lottie className="h-[10rem]" loop={true} animationData={loadingMotion} />
  );
}
