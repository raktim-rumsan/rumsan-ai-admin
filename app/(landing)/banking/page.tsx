import { CTASection } from "@/components/banking/cta-section";
import { FeaturesSection } from "@/components/banking/feature-section";
import { Footer } from "@/components/banking/footer";
import { Navigation } from "@/components/banking/header";
import { HeroSection } from "@/components/banking/hero-section";
import { HowItWorks } from "@/components/banking/how-it-works";
import { PricingSection } from "@/components/banking/pricing";
import { SolutionsSection } from "@/components/banking/solution-section";

export default function BankHome() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <SolutionsSection />
      <HowItWorks />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
