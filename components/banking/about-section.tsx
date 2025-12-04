import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
              About Rumsan
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Rumsan is a technology innovation company dedicated to building
                impactful digital solutions. With a strong focus on AI and
                emerging technologies, we empower organizations to transform
                their operations and deliver exceptional experiences to their
                customers.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Rumsan Chatty
                </span>{" "}
                is our flagship AI chatbot platform designed to make intelligent
                automation accessible to everyone. Our no-code approach allows
                organizations to create, train, and deploy sophisticated AI
                assistants without technical expertise.
              </p>
              <p>
                Built with security, scalability, and ease of use at its core,
                Chatty serves organizations across industries including banking,
                healthcare, education, and more. We're committed to
                democratizing AI technology while maintaining the highest
                standards of data protection and compliance.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <Image
              src="/images/rumsan-office.jpg"
              alt="Rumsan Office"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
