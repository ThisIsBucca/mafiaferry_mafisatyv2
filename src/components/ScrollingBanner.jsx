'use client'

import { useRef } from 'react'
import { Anchor, Ship, Calendar, MapPin, Phone, Clock, Info } from 'lucide-react'
import { useI18n } from '../lib/i18n'

export function ScrollingBanner() {
  const { t } = useI18n()

  const announcements = [
    { icon: <Anchor className="h-4 w-4" />, text: t("banner.welcome"), highlight: true },
    { icon: <Ship className="h-4 w-4" />, text: t("banner.schedules") },
    { icon: <MapPin className="h-4 w-4" />, text: t("banner.daily") },
    { icon: <Phone className="h-4 w-4" />, text: t("banner.call") },
    { icon: <Clock className="h-4 w-4" />, text: t("banner.ready") },
    { icon: <Info className="h-4 w-4" />, text: t("banner.safe") },
  ]

  const items = (start) => announcements.map((item, i) => (
    <div key={start + i} className="flex items-center px-4 py-1">
      <div className={`flex items-center gap-2 ${item.highlight ? 'text-primary font-semibold' : 'text-foreground/90'}`}>
        {item.icon}
        <span>{item.text}</span>
      </div>
      {i < announcements.length - 1 && <div className="mx-4 h-4 w-px bg-primary/20" />}
    </div>
  ))

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary/5 via-background to-primary/5">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="relative py-3 border-y border-primary/10 overflow-hidden">
        <div className="inline-flex whitespace-nowrap items-center scrolling-banner-track">
          <div className="flex items-center">{items(0)}</div>
          <div className="flex items-center">{items(6)}</div>
        </div>
      </div>
      <style>{`
        .scrolling-banner-track {
          animation: scrollBanner 30s linear infinite;
        }
        .scrolling-banner-track:hover {
          animation-play-state: paused;
        }
        @keyframes scrollBanner {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}