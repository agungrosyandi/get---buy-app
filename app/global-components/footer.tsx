"use client";

import { usePathname } from "next/navigation";
import { disableFooter } from "../utils/disable-footer";

export default function Footer() {
  const path = usePathname();
  const hideFooter = disableFooter.includes(path);

  return (
    <>
      {!hideFooter && (
        <section className="relative mt-auto py-5">
          <div className="flex flex-col gap-5 justify-center items-center">
            <h1 className="text-xl font-bold">About Get & Buy</h1>
            <div className="flex text-xs flex-col gap-5 justify-center items-center text-center">
              <p>
                Experience the freedom of true wireless audio with UltraTech
                Wireless Earbuds. Designed for comfort and exceptional sound
                quality, these earbuds deliver deep bass, clear mids, and crisp
                highs. Equipped with advanced noise cancellation technology,
                they let you enjoy your favorite music without distractions.
                With a long-lasting battery life of up to 30 hours (with
                charging case), touch controls, and seamless Bluetooth 5.3
                connectivity, UltraTech Wireless Earbuds are perfect for
                workouts, travel, or daily use. Sweat-resistant and
                ergonomically designed, they ensure a secure fit for all-day
                comfort. Upgrade your audio experience today with UltraTech
                Wireless Earbuds!
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
