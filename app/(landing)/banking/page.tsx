import { CTASection } from "@/components/banking/cta-section";
import { FeaturesSection } from "@/components/banking/feature-section";
import { Footer } from "@/components/banking/footer";
import { Header } from "@/components/banking/header";
import { HeroSection } from "@/components/banking/hero-section";
import { TestimonialsSection } from "@/components/banking/testinimial-section";

export default function BankHome() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
