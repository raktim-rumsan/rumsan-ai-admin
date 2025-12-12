import { Building2, CreditCard, FileCheck, Users } from "lucide-react";

const solutionCards = [
  {
    icon: Building2,
    title: "AI Banking Assistant",
    description:
      "Automate customer queries about accounts, balances, transactions, and general banking services. Reduce call center volume and improve customer satisfaction with instant, accurate responses.",
    tags: [
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
    tags: [
      "Loan inquiries",
      "Interest rates",
      "EMI calculator",
      "Card benefits",
    ],
  },
  {
    icon: FileCheck,
    title: "KYC & Compliance Automation",
    description:
      "Guide customers through KYC requirements, document submissions, and regulatory compliance. Provide instant answers about required documents, verification status, and compliance policies.",
    tags: [
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
    tags: [
      "Internal SOPs",
      "Policy access",
      "Product training",
      "Departmental knowledge",
    ],
  },
];

export function UseCasesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#DC143C]/5 via-purple-500/5 to-[#003893]/5 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="solutionGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#solutionGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Banking Solutions for{" "}
            <span className="bg-gradient-to-r from-[#DC143C] via-purple-500 to-[#003893] bg-clip-text text-transparent">
              Every Need
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Purpose-built AI assistants for banks and MFIs. From customer
            support to internal operations – Chatty handles it all with
            banking-grade security.
          </p>
        </div>

        {/* Solution Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {solutionCards.map((card) => (
            <div
              key={card.title}
              className="group relative p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#DC143C]/20 via-purple-500/20 to-[#003893]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              <div className="absolute inset-[1px] rounded-xl bg-background group-hover:bg-gradient-to-br group-hover:from-background group-hover:via-background group-hover:to-purple-500/5 transition-all duration-500" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DC143C]/10 to-[#003893]/10 border border-border/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-300">
                  <card.icon className="w-6 h-6 text-foreground/70 group-hover:text-purple-500 transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#DC143C] group-hover:via-purple-500 group-hover:to-[#003893] group-hover:bg-clip-text transition-all duration-300">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {card.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-[#DC143C]/5 to-[#003893]/5 border border-border/50 text-muted-foreground group-hover:border-purple-500/20 group-hover:text-foreground/80 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
