import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">RUMSAN AI</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Products
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Solutions
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
        </nav>

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
      </div>
    </header>
  )
}