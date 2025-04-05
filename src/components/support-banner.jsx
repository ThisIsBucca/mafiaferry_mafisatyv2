import { Phone, Mail } from "lucide-react"

export function SupportBanner() {
  return (
    <div className="bg-primary text-primary-foreground py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="tel:+233244444444" className="flex items-center hover:text-primary-foreground/80">
              <Phone className="h-4 w-4 mr-2" />
              <span>+233 24 444 4444</span>
            </a>
            <a href="mailto:info@mafiaferry.com" className="flex items-center hover:text-primary-foreground/80">
              <Mail className="h-4 w-4 mr-2" />
              <span>info@mafiaferry.com</span>
            </a>
          </div>
          <div className="text-sm">
            <span>Operating Hours: 6:00 AM - 10:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  )
} 