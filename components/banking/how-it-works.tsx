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
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#DC143C]/2 via-purple-500/2 to-[#003893]/2 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Get started with Rumsan Chatty in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div
            className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-[#DC143C]/20 via-purple-500/20 to-[#003893]/20"
            style={{ width: "calc(100% - 10rem)", left: "5rem" }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#DC143C] to-[#003893] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#DC143C]/30 transition-all duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-medium text-[#DC143C] mb-2">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-[#003893] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-[220px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
