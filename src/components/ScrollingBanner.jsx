import { useEffect, useRef } from 'react'
import { Anchor, Ship, Calendar, MapPin } from 'lucide-react'

export function ScrollingBanner() {
  const bannerRef = useRef(null)

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return

    // Set up the animation
    const duration = 30 // seconds for one complete scroll
    banner.style.animation = `scroll ${duration}s linear infinite`

    // Add the keyframes to the document
    const style = document.createElement('style')
    style.textContent = `
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const spacer = <span className="inline-block w-[50px]"></span>

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-3 border-y border-border">
      <div className="inline-flex whitespace-nowrap">
        <div 
          ref={bannerRef}
          className="flex items-center text-primary font-medium animate-scroll"
        >
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
        </div>
        <div 
          className="flex items-center text-primary font-medium animate-scroll"
          aria-hidden="true"
        >
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
          <span className="flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            <span className="font-semibold">Karibu Mafiaferry</span>
            <span className="text-muted-foreground">|</span>
            <Ship className="h-4 w-4" />
            <span>Ratiba za Meli</span>
            <span className="text-muted-foreground">|</span>
            <MapPin className="h-4 w-4" />
            <span>Kila Siku Kiswani Mafia</span>
          </span>
          {spacer}
        </div>
      </div>
    </div>
  )
} 