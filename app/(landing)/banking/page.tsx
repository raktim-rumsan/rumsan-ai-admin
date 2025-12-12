import type { Metadata } from "next";
import { UseCasesSection } from "@/components/banking/use-cases-section";
import { Footer } from "@/components/banking/footer";
import { Navigation } from "@/components/banking/header";
import { HeroSection } from "@/components/banking/hero-section";
import { HowItWorks } from "@/components/banking/how-it-works";
import { PricingSection } from "@/components/banking/pricing";
import { FeaturesSection } from "@/components/banking/features-sections";
import { AboutSection } from "@/components/banking/about-section";
import { CTASection } from "@/components/banking/cta-section";

export const metadata: Metadata = {
  title:
    "AI Banking Assistant - No-Code AI Chatbot for Banks | Rumsan AI Banking",
  description:
    "Create and deploy your AI banking assistant without writing any code. Upload documents, train your AI, and deploy across web, Slack, and WhatsApp in minutes. Reduce call-center workload and deliver instant banking support 24/7.",
  keywords: [
    "AI banking assistant",
    "banking chatbot",
    "no-code AI",
    "banking automation",
    "customer support AI",
    "banking AI solutions",
    "financial services chatbot",
    "24/7 banking support",
    "multi-channel banking",
    "Rumsan AI banking",
  ],
  openGraph: {
    title: "AI Banking Assistant - No-Code AI Chatbot for Banks",
    description:
      "Create and deploy your AI banking assistant without writing any code. Reduce call-center workload and deliver instant banking support 24/7 across web, Slack, and WhatsApp.",
    type: "website",
    siteName: "Rumsan AI Banking",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Banking Assistant - No-Code AI Chatbot for Banks",
    description:
      "Deploy AI banking assistants in minutes. No coding required. Multi-channel support across web, Slack, and WhatsApp.",
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

export default function BankHome() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <UseCasesSection />
      <HowItWorks />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <AboutSection />
      <Footer />
    </main>
  );
}
