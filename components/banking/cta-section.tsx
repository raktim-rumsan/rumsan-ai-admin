import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Premium Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-[#003893]/90 to-gray-900/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#DC143C]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#003893]/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DC143C]/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
          Ready to Transform Your&nbps;
          <span className="bg-gradient-to-r from-[#DC143C] via-purple-400 to-[#4078d3] bg-clip-text text-transparent">
            Banking Experience
          </span>
          ?
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-10">
          Join leading financial institutions leveraging AI to deliver
          exceptional customer service and streamline operations.
        </p>
        <Link href="/auth/login">
          <button className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#DC143C] via-purple-500 to-[#003893] text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 cursor-pointer">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#003893] via-purple-500 to-[#DC143C] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </Link>
      </div>
    </section>
  );
}
