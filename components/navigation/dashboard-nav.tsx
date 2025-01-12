"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { JSX } from "react";

export default function DashboardNav({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: JSX.Element }[];
}) {
  const pathName = usePathname();

  return (
    <nav className="py-2 overflow-auto mb-[1rem]">
      <ul className="flex gap-6 text-xs">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.96 }} key={link.path}>
              <Link
                href={link.path}
                className={cn(
                  "relative flex gap-1 flex-col items-center",
                  pathName === link.path && "text-[#d47171]"
                )}
              >
                {link.icon}
                {link.label}
                {pathName === link.path ? (
                  <motion.div
                    className="absolute h-[3px] w-full rounded-full bg-[#d47171] z-0 left-0 -bottom-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
