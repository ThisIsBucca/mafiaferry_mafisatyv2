import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Coffee, ExternalLink, Briefcase, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-primary/5 pt-16 pb-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-30" />
      
      <div className="container relative">
        {/* Main Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* About Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              About Us
            </h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              We provide reliable ferry services between Mafia Island and the mainland, ensuring safe and comfortable journeys for all our passengers.
            </p>
            {/* Support Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <a
                href="https://www.buymeacoffee.com/buccadev"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-xl hover:bg-[#FFDD00]/90 transition-all duration-300 shadow-lg hover:shadow-[#FFDD00]/25"
              >
                <Coffee className="h-5 w-5" />
                <span className="font-medium">Buy me a coffee</span>
                <ExternalLink className="h-4 w-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </a>
              <a
                href="https://buccaportfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary/20 transition-all duration-300"
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-medium">View Portfolio</span>
                <ExternalLink className="h-4 w-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/schedule" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/book" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/faq" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="group flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                <span className="group-hover:text-foreground transition-colors">+255 776 986 640</span>
              </li>
              <li className="group flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                <span className="group-hover:text-foreground transition-colors">buccaphilox0104@gmail.com</span>
              </li>
              <li className="group flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                <span className="group-hover:text-foreground transition-colors">
                  Kigamboni,<br />
                  Kilindoni, Kisiwa cha Mafia,<br />
                  Tanzania
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100082410383074"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl bg-primary/10 p-3 text-primary hover:bg-primary/20 transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Facebook className="h-5 w-5 relative z-10" />
              </a>
              <a
                href="https://x.com/buccaprezdz33"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl bg-primary/10 p-3 text-primary hover:bg-primary/20 transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Twitter className="h-5 w-5 relative z-10" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-border/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mafia Ferry Service. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Designed & Developed by{" "}
              <a
               href="https://thisisbucca.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                thisisbucca
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
