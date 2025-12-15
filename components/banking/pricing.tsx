import { Check, ArrowRight } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    workspaces: "1 Workspace",
    features: [
      "Single department setup",
      "Web & mobile integration",
      "Basic analytics",
      "Email support",
      "1,000 queries/month",
    ],
  },
  {
    name: "Professional",
    workspaces: "Up to 5 Workspaces",
    features: [
      "Multi-department setup",
      "WhatsApp integration",
      "Advanced analytics",
      "Priority support",
      "10,000 queries/month",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    workspaces: "Unlimited Workspaces",
    features: [
      "Unlimited departments",
      "All integrations",
      "Custom AI training",
      "Dedicated support",
      "Unlimited queries",
      "Custom branding",
      "API access",
      "SLA guarantee",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#DC143C]/5 via-purple-500/5 to-[#003893]/5 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pricingGrid"
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
          <rect width="100%" height="100%" fill="url(#pricingGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Workspace-Based{" "}
            <span className="bg-gradient-to-r from-[#DC143C] via-purple-500 to-[#003893] bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Pricing depends on the number of workspaces your bank creates. Scale
            as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#DC143C]/20 via-purple-500/20 to-[#003893]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              <div className="absolute inset-[1px] rounded-3xl bg-background group-hover:bg-gradient-to-br group-hover:from-background group-hover:via-background group-hover:to-purple-500/5 transition-all duration-500" />

              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#DC143C] group-hover:via-purple-500 group-hover:to-[#003893] group-hover:bg-clip-text transition-all duration-300">
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {tier.workspaces}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#DC143C]/10 to-[#003893]/10 border border-border/50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-purple-500/30 transition-colors">
                        <Check className="w-3 h-3 text-foreground/70 group-hover:text-purple-500 transition-colors" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className="w-full group relative px-10 py-4 bg-white text-[#003893] font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#DC143C]/30 hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C]/10 via-white to-[#003893]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
