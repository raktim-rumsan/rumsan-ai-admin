import { Card, CardContent } from "@/components/ui/card";
import { Landmark, CreditCard, Shield, Users } from "lucide-react";

export function UseCasesSection() {
  const useCases = [
    {
      icon: Landmark,
      title: "AI Banking Assistant",
      description:
        "Automate customer queries about accounts, balances, transactions, and general banking services. Reduce call center volume and improve customer satisfaction with instant, accurate responses.",
      features: [
        "Account inquiries",
        "Balance checks",
        "Transaction history",
        "Branch information",
      ],
    },
    {
      icon: CreditCard,
      title: "Loan & Card Support",
      description:
        "Answer questions about loan applications, interest rates, EMI calculations, credit card features, rewards programs, and payment options. Help customers make informed financial decisions.",
      features: [
        "Loan inquiries",
        "Interest rates",
        "EMI calculator",
        "Card benefits",
      ],
    },
    {
      icon: Shield,
      title: "KYC & Compliance Automation",
      description:
        "Guide customers through KYC requirements, document submissions, and regulatory compliance. Provide instant answers about required documents, verification status, and compliance policies.",
      features: [
        "KYC requirements",
        "Document guidance",
        "Verification status",
        "Compliance info",
      ],
    },
    {
      icon: Users,
      title: "Internal Banking Assistant",
      description:
        "Create secure internal assistants for bank staff. Access SOPs, policies, product knowledge, and internal documentation with role-based access control for different departments.",
      features: [
        "Internal SOPs",
        "Policy access",
        "Product training",
        "Departmental knowledge",
      ],
    },
  ];

  return (
    <section
      id="use-cases"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Banking Solutions for Every Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Purpose-built AI assistants for banks and MFIs. From customer
            support to internal operations – Chatty handles it all with
            banking-grade security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card
                key={index}
                className="border-border bg-card hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{useCase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {useCase.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
