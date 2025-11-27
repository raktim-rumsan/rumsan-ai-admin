import { getLandingPage } from "@/lib/dynamic-landing";
import BankHome from "./(landing)/banking/page";
import HomePage from "./(landing)/home/page";
import VetHome from "./(landing)/veterinary/page";

export default function LandingPage() {
  const landingPage = getLandingPage();

  switch (landingPage) {
    case "banking":
      return <BankHome />;
    case "veterinary":
      return <VetHome />;
    default:
      return <HomePage />;
  }
}
