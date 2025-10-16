import { ChatInterface } from "./chat-interface";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Intelligent Banking, Simplified
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
            RUMSAN AI is an innovative conversational assistant with smart card assistance, and organizational tools for
            modern banks.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <ChatInterface />
        </div>
      </div>
    </section>
  )
}