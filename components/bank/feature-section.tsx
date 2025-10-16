import { Card } from "@/components/ui/card"
import { FileText, MessageSquare, Settings } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Document Management",
      description:
        "Securely store, organize, and access documents with advanced search capabilities. Streamline your document workflow and improve team collaboration.",
      link: "Learn more →",
    },
    {
      icon: MessageSquare,
      title: "Intelligent Chat Assistant",
      description:
        "Leverage AI-powered conversational assistant to assist customers with their banking needs. Provides instant responses and personalized recommendations.",
      link: "Learn more →",
    },
    {
      icon: Settings,
      title: "Organizational Tools",
      description:
        "Comprehensive suite of tools to manage your organization efficiently. Track performance metrics, automate workflows, and integrate with existing systems.",
      link: "Learn more →",
    },
  ]

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Powerful Features for Modern Banking
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Everything you need to deliver exceptional banking experiences and streamline operations in one intelligent
            platform.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                {feature.link}
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}