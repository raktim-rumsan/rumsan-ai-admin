import { CheckCircle2, Globe, Shield, Database, Users } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Handles 80% of FAQs",
      description: "Automates common customer queries instantly",
    },
    {
      icon: Globe,
      title: "Works on Web, WhatsApp, Mobile",
      description: "Deploy across all channels seamlessly",
    },
    {
      icon: Users,
      title: "Human Fallback",
      description: "Seamlessly transfer to human agents when needed",
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "Secure permission management",
    },
    {
      icon: Database,
      title: "Workspace-Based Knowledge",
      description: "Organized departmental training",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Comprehensive Features for Modern Organizations
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Everything you need to deliver exceptional customer support and
            streamline operations
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <Icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
