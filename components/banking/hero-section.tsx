import { Clock, Globe, Sparkles, Zap } from "lucide-react";
import { ChatInterface } from "./chat-interface";

export function HeroSection() {
  return (
    <section id="home" className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          {/* AI Badge with gradient */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20" />
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-medium text-sm">
              No Code Required • AI-Powered
            </span>
          </div>

          {/* Heading with gradient on "AI Banking Assistant" */}
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight text-foreground">
            <span className="block">Create & Deploy Your</span>
            <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Banking Assistant
            </span>
            <span className="block">Without Writing Any Code</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            No coding, no complexity. Just upload your documents, train your AI,
            and deploy across web, slack, and WhatsApp in minutes. Reduce
            call-center workload and deliver instant banking support 24/7.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-stretch gap-6 pt-4">
            {/* Card 1 - FAQs Automated */}
            <div className="group relative flex-1 min-w-[140px] p-5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-[#DC143C]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#DC143C]/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#DC143C]/5 via-transparent to-[#003893]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#DC143C] to-[#003893] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-foreground">80%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    FAQs Automated
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - 24/7 Support */}
            <div className="group relative flex-1 min-w-[140px] p-5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-[#003893]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#003893]/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#003893]/5 via-transparent to-[#DC143C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#003893] to-[#DC143C] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-foreground">24/7</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Banking Support
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Multi-Channel */}
            <div className="group relative flex-1 min-w-[140px] p-5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-[#DC143C]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#DC143C]/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#DC143C]/5 via-transparent to-[#003893]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-[1px] rounded-2xl bg-background group-hover:bg-gradient-to-br group-hover:from-background group-hover:via-background group-hover:to-purple-500/5 transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#DC143C] to-[#003893] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-300">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#DC143C] group-hover:via-purple-500 group-hover:to-[#003893] group-hover:bg-clip-text transition-all duration-300">
                  Multi-Channel
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Web, Slack, WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center h-full">
          <ChatInterface className="h-auto" />
        </div>
      </div>
    </section>
  );
}
