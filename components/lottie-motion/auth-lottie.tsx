"use client";

import authMotionLottie from "@/public/motion/login-motion-graphic.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function AuthLottie() {
  return (
    <Lottie
      className="h-[28rem]"
      loop={true}
      animationData={authMotionLottie}
    />
  );
}
