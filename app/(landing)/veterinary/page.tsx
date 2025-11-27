import { Footer } from "@/components/banking/footer";
import { FeaturesSection } from "@/components/veterinary/feature-section";
import { Header } from "@/components/veterinary/header";
import { HeroSection } from "@/components/veterinary/hero-section";
import { TestimonialsSection } from "@/components/veterinary/testimonial-section";

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
