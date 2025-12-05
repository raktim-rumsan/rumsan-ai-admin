import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
              Rumsan Chatty
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">
                  Rumsan Chatty
                </span>{" "}
                is an AI chatbot platform designed to make intelligent
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

          <div className="flex justify-center lg:justify-end">
            <Image
              src="https://assets.rumsan.net/rumsan-group/about-rumsan-chatty-ai.png"
              alt="Rumsan Office"
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
