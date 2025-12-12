import Image from "next/image";

export function AboutSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Rumsan{" "}
              <span className="bg-gradient-to-r from-[#DC143C] to-[#003893] bg-clip-text text-transparent">
                Chatty
              </span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">Rumsan Chatty</span>{" "}
              is an AI chatbot platform designed to make intelligent automation
              accessible to everyone. Our no-code approach allows organizations
              to create, train, and deploy sophisticated AI assistants without
              technical expertise.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Built with security, scalability, and ease of use at its core,
              Chatty serves organizations across industries including banking,
              healthcare, education, and more. We're committed to democratizing
              AI technology while maintaining the highest standards of data
              protection and compliance.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C]/20 to-[#003893]/20 rounded-full blur-3xl scale-75" />
            <Image
              src="https://assets.rumsan.net/rumsan-group/nepali-robot.png"
              alt="Rumsan Ai Bot"
              width={500}
              height={300}
              className="h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
