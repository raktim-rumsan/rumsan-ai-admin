import { Linkedin, Mail, MapPin, Phone, Youtube, Bot } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-secondary/30 border-t border-border py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div>
                <Image
                  src="https://assets.rumsan.net/rumsan-group/rumsan-square0.png"
                  alt="Rumsan Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-4xl">RUMSAN</span>
            </div>
            <p className="text-md text-muted-foreground">
              We are a blockchain-focused digital innovation company in Nepal
              and the US. We specialize in digital solutions for finance,
              healthcare, decentralized identity and humanitarian sectors.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:team@rumsan.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    team@rumsan.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {" "}
                    +977 9801074667
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 hrink-0" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Sanepa, Lalitpur, Nepal
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/rumsan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://www.youtube.com/@rumsan1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="X/Twitter"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Rumsan. Built in Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
}
