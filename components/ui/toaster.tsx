"use client";

import { Toaster as Toasty } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Toaster() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toasty
      richColors
      theme={
        (theme || resolvedTheme) as "light" | "dark" | "system" | undefined
      }
    />
  );
}
