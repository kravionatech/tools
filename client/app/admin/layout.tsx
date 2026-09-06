import { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminContext";

export const metadata: Metadata = {
  title: "Admin Portal | Kraviona Tools",
  description: "Administrative console and analytics dashboard for Kraviona Tools.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
