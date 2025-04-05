"use client";

import onDevelopmentLottie from "@/public/motion/on development.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function DevelopmentLottie() {
  return (
    <Lottie
      className="h-[10rem] tabletMinWidth:h-[15rem] desktopMinWidth:h-[20rem]"
      loop={true}
      animationData={onDevelopmentLottie}
    />
  );
}
