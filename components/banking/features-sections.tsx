import { Zap, Globe, UserCheck, Lock, BookOpen } from "lucide-react";

const comprehensiveFeatures = [
  {
    icon: Zap,
    title: "Handles 80% of FAQs",
    description: "Automates common customer queries instantly",
  },
  {
    icon: Globe,
    title: "Works on Web, WhatsApp, Mobile",
    description: "Deploy across all channels seamlessly",
  },
  {
    icon: UserCheck,
    title: "Human Fallback",
    description: "Seamless transfer to human agents when needed",
  },
  {
    icon: Lock,
    title: "Role-Based Access Control",
    description: "Secure permission management",
  },
  {
    icon: BookOpen,
    title: "Workspace-Based Knowledge",
    description: "Organized departmental training",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#DC143C]/5 via-purple-500/5 to-[#003893]/5 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="featuresGrid"
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
          <rect width="100%" height="100%" fill="url(#featuresGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Comprehensive Features for{" "}
            <span className="bg-gradient-to-r from-[#DC143C] via-purple-500 to-[#003893] bg-clip-text text-transparent">
              Modern Organizations
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to deliver exceptional customer support and
            streamline operations
          </p>
        </div>

        {/* First row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-6xl mx-auto">
          {comprehensiveFeatures.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#DC143C]/20 via-purple-500/20 to-[#003893]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              <div className="absolute inset-[1px] rounded-xl bg-background group-hover:bg-gradient-to-br group-hover:from-background group-hover:via-background group-hover:to-purple-500/5 transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DC143C]/10 to-[#003893]/10 border border-border/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-foreground/70 group-hover:text-purple-500 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#DC143C] group-hover:via-purple-500 group-hover:to-[#003893] group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Second row: 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {comprehensiveFeatures.slice(3, 5).map((feature, index) => (
            <div
              key={index + 3}
              className="group relative p-6 rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#DC143C]/20 via-purple-500/20 to-[#003893]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              <div className="absolute inset-[1px] rounded-3xl bg-background group-hover:bg-gradient-to-br group-hover:from-background group-hover:via-background group-hover:to-purple-500/5 transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DC143C]/10 to-[#003893]/10 border border-border/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-foreground/70 group-hover:text-purple-500 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#DC143C] group-hover:via-purple-500 group-hover:to-[#003893] group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
