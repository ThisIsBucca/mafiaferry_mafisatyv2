import { Phone, Mail, MapPin } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground/90 mb-4">Wasiliana Nasi</h2>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto">
            Tupigie simu, tuandikie barua pepe au ujiunge na vikundi vyetu vya WhatsApp kwa habari za sasa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Phone */}
          <div className="bg-card/80 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary/90" />
              </div>
              <h3 className="text-xl font-semibold text-foreground/90">Simu</h3>
            </div>
            <p className="text-muted-foreground/80">
              Tupigie:
            </p>
            <a 
              href="tel:+255777000000" 
              className="text-primary/90 hover:text-primary/70 block mt-2 text-lg"
            >
              +255 776 986 840
            </a>
          </div>

          {/* Email */}
          <div className="bg-card/80 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="h-6 w-6 text-primary/90" />
              </div>
              <h3 className="text-xl font-semibold text-foreground/90">Barua Pepe</h3>
            </div>
            <p className="text-muted-foreground/80">
              Tuandikie:
            </p>
            <a 
              href="mailto:info@mafiaferry.com" 
              className="text-primary/90 hover:text-primary/70 block mt-2 text-lg"
            >
              buccaphilox0104@gmail.com
            </a>
          </div>

          {/* Address */}
          <div className="bg-card/80 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="h-6 w-6 text-primary/90" />
              </div>
              <h3 className="text-xl font-semibold text-foreground/90">Anwani</h3>
            </div>
            <p className="text-muted-foreground/80">
              Tupate:
            </p>
            <p className="text-foreground/90 mt-2 text-lg">
              Kigamboni,<br />
              Kilindoni, Kisiwa cha Mafia,<br />
              Tanzania
            </p>
          </div>
        </div>

        {/* WhatsApp Groups Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Passengers Group */}
          <div className="bg-card/80 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#25D366]/90" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-foreground/90">Kikundi cha Mafiaferry-Schedule</h3>
                <p className="text-sm text-muted-foreground/80">Wanachama 256</p>
              </div>
            </div>
            <p className="text-muted-foreground/80 mb-4">
              Jiunge na kikundi chetu cha WhatsApp cha abiria kwa sasisho za ratiba, matangazo, na mazungumzo ya jamii.
            </p>
            <a 
              href="https://chat.whatsapp.com/DpEfq8kAhFlCNJDMZht8c2" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-[#25D366]/90 text-white px-4 py-2 rounded-lg hover:bg-[#25D366]/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Jiunge na Kikundi
            </a>
          </div>

          {/* Business Group */}
          <div className="bg-card/80 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#25D366]/90" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-foreground/90">Kikundi cha Mafiaferry-Business</h3>
                <p className="text-sm text-muted-foreground/80">Wanachama 124</p>
              </div>
            </div>
            <p className="text-muted-foreground/80 mb-4">
              Jiunge na wafanyabiashara wengine na upate sasisho za huduma za mizigo na fursa za biashara.
            </p>
            <a 
              href="https://chat.whatsapp.com/GKtI7pGZk8R2sFG8oOLG4Y" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-[#25D366]/90 text-white px-4 py-2 rounded-lg hover:bg-[#25D366]/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Jiunge na Kikundi
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 