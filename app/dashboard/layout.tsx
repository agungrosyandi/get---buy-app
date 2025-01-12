import DashboardNav from "@/components/navigation/dashboard-nav";
import { auth } from "@/server/auth";
import { BarChart, Settings, Truck } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const userLink = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;

  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <BarChart size={16} />,
          },
          {
            label: "Product",
            path: "/dashboard/product",
            icon: <BarChart size={16} />,
          },
        ]
      : [];

  const allLinks = [...adminLinks, ...userLink];

  return (
    <div>
      <DashboardNav allLinks={allLinks} />

      {children}
    </div>
  );
}
