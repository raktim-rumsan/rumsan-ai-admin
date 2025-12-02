import { FolderPlus, Users, Brain, Rocket } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: FolderPlus,
      step: "01",
      title: "Create Your Workspace",
      description:
        "Create a dedicated workspace for your bank or department to manage documents, configurations, and AI settings.",
    },
    {
      icon: Users,
      step: "02",
      title: "Invite Admins & Members",
      description:
        "Invite admins and staff with role-based access to upload documents, manage knowledge, and maintain accuracy.",
    },
    {
      icon: Brain,
      step: "03",
      title: "Train Your AI",
      description:
        "Upload banking documents like FAQs, KYC, SOPs, and policies for Chatty to learn and provide accurate answers.",
    },
    {
      icon: Rocket,
      step: "04",
      title: "Deploy & Assist",
      description:
        "Deploy the chatbot on your website or app, offering customers instant answers about banking services anytime.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Get started with Rumsan Chatty in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div
            className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-border"
            style={{ width: "calc(100% - 10rem)", left: "5rem" }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 relative z-10">
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="text-sm font-mono text-primary font-semibold mb-2">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-balance">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
