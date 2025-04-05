"use client";

import React from "react";
import DevelopmentLottie from "../lottie-motion/on-development";
import { useCartStore } from "@/lib/zustand/client-store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPayment() {
  const { setCheckoutProgress } = useCartStore();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-3">
      <DevelopmentLottie />

      <span
        onClick={() => setCheckoutProgress("cart-page")}
        className="flex items-center justify-center gap-1 text-xs  cursor-pointer hover:text-primary"
      >
        <ArrowLeft size={14} />
        Back to chart
      </span>

      <span>or</span>

      <Link
        href={
          "https://shopee.co.id/?gad_source=1&gclid=CjwKCAiAzPy8BhBoEiwAbnM9O6IltHhaZkeeN39jrYWilW0D3OeIpWylXvsK_ygk7cjwbfQ-bYU9xxoCoDoQAvD_BwE"
        }
        target="_blank"
      >
        <span className="flex items-center justify-center gap-1 text-xs cursor-pointer hover:text-primary">
          Buy souvenir in our official external marketplace
        </span>
      </Link>
    </div>
  );
}
