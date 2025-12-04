import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { StoreInitializer } from "@/lib/store-hydration";
import { OrganizationContextProvider } from "@/providers/OrganizationContextProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rumsan AI - AI-Powered Admin Dashboard",
    template: "%s | Rumsan AI",
  },
  description:
    "Rumsan AI combines document management, intelligent chat assistance, and organizational tools in one powerful platform designed for modern teams.",
  keywords: [
    "AI admin dashboard",
    "document management",
    "AI chat assistant",
    "business automation",
    "Rumsan AI",
  ],
  authors: [{ name: "Rumsan" }],
  creator: "Rumsan",
  publisher: "Rumsan",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <StoreInitializer shouldInitializeAuth={false}>
            <OrganizationContextProvider>
              {children}
            </OrganizationContextProvider>
          </StoreInitializer>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
