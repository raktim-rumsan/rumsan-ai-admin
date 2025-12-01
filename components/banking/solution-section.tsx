import {
  CreditCard,
  FileCheck,
  AlertTriangle,
  Headphones,
  Banknote,
  Building2,
} from "lucide-react";

export function SolutionsSection() {
  const solutions = [
    {
      icon: Building2,
      title: "AI Banking Assistant",
      description:
        "Intelligent conversational AI that understands banking terminology and customer intent",
    },
    {
      icon: FileCheck,
      title: "KYC & Compliance Automation",
      description:
        "Automated document verification and compliance query handling",
    },
    {
      icon: Banknote,
      title: "Loan Inquiry Automation",
      description:
        "Instant responses to loan eligibility, rates, and application status",
    },
    {
      icon: CreditCard,
      title: "Card & ATM Support",
      description:
        "Quick assistance for card issues, ATM locations, and transaction queries",
    },
    {
      icon: AlertTriangle,
      title: "Fraud & Risk Query Assistance",
      description: "Real-time fraud alerts and risk assessment query handling",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support AI",
      description:
        "Always-on support that never sleeps, reducing call center burden",
    },
  ];

  return (
    <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Solutions for Modern Banking
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive AI-powered solutions designed specifically for
            financial institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
