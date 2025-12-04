import type { Metadata } from "next";
import { Footer } from "@/components/banking/footer";
import { FeaturesSection } from "@/components/veterinary/feature-section";
import { Header } from "@/components/veterinary/header";
import { HeroSection } from "@/components/veterinary/hero-section";
import { TestimonialsSection } from "@/components/veterinary/testimonial-section";

export const metadata: Metadata = {
  title:
    "AI Veterinary Assistant - Intelligent Veterinary Care Management | Rumsan AI",
  description:
    "Deliver AI-powered document management, smart appointment scheduling, and personalized pet care recommendations for modern veterinary practices. Simplify veterinary operations with intelligent automation.",
  keywords: [
    "veterinary AI assistant",
    "veterinary practice management",
    "pet care AI",
    "veterinary chatbot",
    "appointment scheduling AI",
    "veterinary document management",
    "animal healthcare AI",
    "veterinary practice automation",
    "pet health management",
    "Rumsan AI veterinary",
  ],
  openGraph: {
    title: "AI Veterinary Assistant - Intelligent Veterinary Care Management",
    description:
      "Deliver AI-powered document management, smart appointment scheduling, and personalized pet care recommendations for modern veterinary practices.",
    type: "website",
    siteName: "Rumsan AI Veterinary",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Veterinary Assistant - Intelligent Veterinary Care Management",
    description:
      "Simplify veterinary operations with AI-powered document management, appointment scheduling, and pet care recommendations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function VetHome() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
