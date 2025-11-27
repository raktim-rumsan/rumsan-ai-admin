import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Experience RUMSAN AI</h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/90">
          Join hundreds of banks transforming their customer experience with intelligent AI-powered tools.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
            <Play className="mr-2 h-4 w-4" />
            Sign 
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Get Started
          </Button>
        </div>

        <p className="mt-6 text-sm text-primary-foreground/80">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  )
}