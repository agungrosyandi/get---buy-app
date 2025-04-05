"use client";

import homePageMotion from "@/public/motion/Product Development.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HomePageLottie() {
  return (
    <Lottie className="h-[30rem]" loop={true} animationData={homePageMotion} />
  );
}
