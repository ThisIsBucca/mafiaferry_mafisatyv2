import { Phone, Mail, MapPin, ExternalLink } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="relative py-20 bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.1),transparent_50%)] pointer-events-none" />
      
      <div className="container relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground/90 mb-4">
            Wasiliana Nasi
          </h2>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
            Tupigie simu, tuandikie barua pepe au ujiunge na vikundi vyetu vya WhatsApp kwa habari za sasa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Phone Card */}
          <div className="group relative bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-border/10 hover:border-primary/20 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground/90 to-foreground/80">Simu</h3>
              </div>
              <p className="text-muted-foreground/80 mb-4">
                Tupigie muda wowote:
              </p>
              <a 
                href="tel:+255776986840" 
                className="group/link flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors"
              >
                +255 776 986 840
                <ExternalLink className="h-4 w-4 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="group relative bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-border/10 hover:border-primary/20 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground/90 to-foreground/80">Barua Pepe</h3>
              </div>
              <p className="text-muted-foreground/80 mb-4">
                Tuandikie wakati wowote:
              </p>
              <a 
                href="mailto:buccaphilox0104@gmail.com" 
                className="group/link flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors"
              >
                buccaphilox0104@gmail.com
                <ExternalLink className="h-4 w-4 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="group relative bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-border/10 hover:border-primary/20 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground/90 to-foreground/80">Anwani</h3>
              </div>
              <p className="text-muted-foreground/80 mb-4">
                Tupate katika:
              </p>
              <div className="text-lg space-y-1">
                <p className="font-medium text-foreground/90">Kigamboni</p>
                <p className="text-foreground/80">Kilindoni, Kisiwa cha Mafia</p>
                <p className="text-foreground/70">Tanzania</p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Groups Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Schedule Group */}
          <div className="group relative bg-card bg-opacity-95 dark:bg-card/90 p-8 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#25D366]/20 rounded-xl border border-[#25D366]/10">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#25D366]" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Kikundi cha Mafiaferry-Schedule</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] shadow-sm shadow-[#25D366]/30"></span>
                    Wanachama 256
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Jiunge na kikundi chetu cha WhatsApp cha abiria kwa sasisho za ratiba, matangazo, na mazungumzo ya jamii.
              </p>
              <a 
                href="https://chat.whatsapp.com/DpEfq8kAhFlCNJDMZht8c2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group/link inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl hover:bg-[#25D366] transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 font-medium"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Jiunge na Kikundi</span>
                <ExternalLink className="h-4 w-4 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Business Group */}
          <div className="group relative bg-card bg-opacity-95 dark:bg-card/90 p-8 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#25D366]/20 rounded-xl border border-[#25D366]/10">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#25D366]" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Kikundi cha Mafiaferry-Business</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] shadow-sm shadow-[#25D366]/30"></span>
                    Wanachama 124
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Jiunge na wafanyabiashara wengine na upate sasisho za huduma za mizigo na fursa za biashara.
              </p>
              <a 
                href="https://chat.whatsapp.com/GKtI7pGZk8R2sFG8oOLG4Y" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group/link inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl hover:bg-[#25D366] transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 font-medium"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Jiunge na Kikundi</span>
                <ExternalLink className="h-4 w-4 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}