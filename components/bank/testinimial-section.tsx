import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Chief Technology Officer, First National Bank",
      content:
        "RUMSAN AI has revolutionized how we engage with customers. The AI-powered assistant handles 80% of routine inquiries, allowing our team to focus on complex cases. The ROI has been exceptional.",
      avatar: "/professional-woman-diverse.png",
    },
    {
      name: "Michael Brown",
      role: "VP of Digital Banking, Community Trust",
      content:
        "The chat assistant works 24/7, providing instant support to our customers. We've seen a 45% increase in customer satisfaction scores since implementing RUMSAN AI. It's been a game-changer for our digital strategy.",
      avatar: "/professional-man.jpg",
    },
  ]

  const bankLogos = ["Small", "Full Service", "Mutual", "Full Service", "Finance", "Quality", "Unity"]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Trusted by Leading Banks</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Over 50+ financial institutions worldwide trust RUMSAN AI to power their customer experience.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>
              <button className="mt-4 text-sm font-medium text-primary hover:underline">Read Case Study</button>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {bankLogos.map((logo, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded bg-muted" />
              <span className="text-sm font-medium">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}