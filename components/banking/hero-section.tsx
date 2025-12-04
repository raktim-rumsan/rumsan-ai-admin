import { Sparkles } from "lucide-react";
import { ChatInterface } from "./chat-interface";

export function HeroSection() {
  return (
    <section id="home" className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              No Code Required • AI-Powered
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance leading-tight">
            Create & Deploy Your AI Banking Assistant
            <span className="text-primary"> Without Writing Any Code</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            No coding, no complexity. Just upload your documents, train your AI,
            and deploy across web, slack, and WhatsApp in minutes. Reduce
            call-center workload and deliver instant banking support 24/7.
          </p>

          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-2xl font-bold text-foreground">80%</div>
              <div className="text-sm text-muted-foreground">
                FAQs Automated
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">
                Banking Support
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                Multi-Channel
              </div>
              <div className="text-sm text-muted-foreground">
                Web, Slack, WhatsApp
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center h-full">
          <ChatInterface className="h-full" />
        </div>
      </div>
    </section>
  );
}
