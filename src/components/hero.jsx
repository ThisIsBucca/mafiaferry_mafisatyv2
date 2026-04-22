import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Clock, MapPin, Ship, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdCarouselCard from "./AdCarouselCard";
import { supabase } from "../lib/supabase";

export function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const images = [
    {
      url: "https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//ferrydaw.jpg",
      caption: "Pwani ya Utende",
    },
    {
      url: "https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//openart-image_qq2r6JCc_1743214522482_raw.jpg",
      caption: "Mto wa Rufiji",
    },
    {
      url: "https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg",
      caption: "Meli ya Kisasa",
    },
  ];

  // Fetch products for the ad carousel dynamically
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [productIndex, setProductIndex] = useState(0);

  // Ad cards data
  const adCards = [
    {
      id: 1,
      category: "Utalii",
      title: "Tembelea Kisiwa cha Mafia na Uzuri wa Asili",
      description: "Karibu na uzuri wa bahari, matumbawe ya asili, na utamaduni wa enzi za kale. Tunakualika kutembelea kisiwa kilovu cha ajabu.",
      image: "https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images/utalii1.jpg",
      link: "https://www.mafiaislandauthentic.com/tours",
      linkText: "Tembelea Sasa",
      theme: "primary",
      isExternal: true,
    },
    {
      id: 2,
      category: "Usafirishaji",
      title: "Sharosa Logistics | usafirishaji wa mizigo Mafia - Dar",
      description: "Usafirishaji wa mizigo salama, haraka na amanini kutoka bara hadi Kisiwa cha Mafia na kurudi kwa bei ya haki.",
      image: "https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images/sharosa.jpg",
      link: "https://wa.me/255776986840",
      linkText: "Wasiliana Nasi",
      theme: "primary",
      isExternal: true,
    },
    {
      id: 3,
      category: "Teknolojia",
      title: "Nordix Tech | Suluhisho za Teknolojia za Kisasa",
      description: "Tunatengeza tovuti(website) za utalii, mifumo ya taasisi na watumishi e.g sms-school management system, programu za simu (mobile apps). Suluhisho kamili za dijitali kwa biashara yako.",
      image: "https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images/nordixLogo.jpg",
      link: "https://wa.me/255776986840",
      linkText: "Jenga Suluhisho",
      theme: "accent",
      isExternal: true,
    },
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

   // Auto-advance ad carousel (only on mobile)
  useEffect(() => {
    if (!isMobile) return; // Disable carousel on desktop
    
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adCards.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [adCards.length, isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextAdCard = () => {
    setCurrentAdIndex((prev) => (prev + 1) % adCards.length);
  };

  const prevAdCard = () => {
    setCurrentAdIndex((prev) => (prev - 1 + adCards.length) % adCards.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scrollToContent = () => {
    const nextSection = document.getElementById("schedule");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden pt-16 sm:pt-0 pb-8 sm:pb-0 bg-gradient-to-br from-background via-primary/10 to-accent/10">
      {/* Background images with parallax effect */}
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${image.url}')`,
            filter: "brightness(0.6)",
          }}
          animate={{
            scale: index === currentImageIndex ? 1.05 : 1,
          }}
          transition={{
            duration: 6,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Content with improved layout and theme correspondence */}
      <div className="container mx-auto px-2 sm:px-4 relative z-10 flex flex-col md:flex-row items-center justify-center h-full gap-8 md:gap-12">
        {/* Main Hero Card */}
        {/* <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full md:w-1/2 flex flex-col items-stretch justify-center text-center max-w-5xl mx-auto gap-4 md:gap-12 md:rounded-3xl md:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        > */}
          {/* Redesigned Hero Content: Modern, minimal, glassmorphic, mobile-first */}
       
       {/*  */}
              {/* <span className="inline-block px-4 py-1.5 rounded-full bg-background/60 backdrop-blur text-primary text-xs font-semibold shadow border border-primary/10">
                {images[currentImageIndex].caption}
              </span>
            </motion.div> */}
            {/* <motion.div
              variants={itemVariants}
              className="relative mb-2 w-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            > */}
              {/* <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground drop-shadow-xl tracking-tight font-display mb-2">
                Mafiaferry
              </h1>
              <h2 className="text-lg sm:text-2xl font-semibold text-foreground/90 font-display mb-3 drop-shadow-md tracking-tight">
                Habari za Usafiri wa Majini Kisiwa cha Mafia Online
              </h2>
              <p className="text-base sm:text-lg text-foreground/80 max-w-md mx-auto font-medium mb-6">
                Taarifa za Vyombo vya Usafiri wa Majini Kati ya Mafia na Bara
              </p> */}
              {/* Cool animated anchor link instead of button/feature list */}

              {/* <a
                href="#schedule"
                className="inline-block w-full sm:w-auto text-center px-8 py-3 rounded-full text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary-foreground text-white shadow-xl hover:scale-105 transition-transform duration-300 animate-gradient-x"
                style={{
                  backgroundSize: "200% 200%",
                  animation: "gradient-x 3s ease-in-out infinite",
                }}
              >
                Angalia Ratiba na Huduma
              </a> */}
              {/* Animated accent circles for depth */}
              {/* <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary/30 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.13, 0.22, 0.13],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              /> */}
              {/* <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.18, 0.1, 0.18],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              /> */}
            {/* </motion.div>
          </div>
        </motion.div> */}

        {/* Modern Premium Ad Cards */}
        <motion.div 
          className="w-full mt-auto pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-white/60 mb-2">
              Matangazo Maarufu
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
          </div>

          {/* Responsive Carousel Container */}
          <div className="relative w-full">
            {/* Carousel Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[500px]">
              {adCards.map((card, index) => {
                // On desktop, always show all cards. On mobile, show based on carousel position
                const isVisible = isMobile
                  ? (index === currentAdIndex) 
                  : true;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`group relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-2xl overflow-hidden border border-white/20 backdrop-blur-xl shadow-2xl hover:shadow-2xl transition-all duration-300 h-full ${
                      isVisible ? "block" : "hidden md:block lg:block"
                    }`}
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-120 brightness-75 group-hover:brightness-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                      <motion.div
                        className={`absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-full bg-gradient-to-r text-${card.theme} backdrop-blur-md border shadow-xl`}
                        style={{
                          backgroundImage: `linear-gradient(to right, hsl(var(--${card.theme})) / 0.3, hsl(var(--${card.theme})) / 0.1)`,
                          borderColor: `hsl(var(--${card.theme}) / 0.4)`,
                          color: `hsl(var(--${card.theme}))`,
                        }}
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full animate-pulse" 
                          style={{ backgroundColor: `hsl(var(--${card.theme}))` }}
                        />
                        {card.category}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-accent transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-base text-white/80 leading-relaxed line-clamp-3">
                          {card.description}
                        </p>
                      </div>

                      <a
                        href={card.link}
                        target={card.isExternal ? "_blank" : undefined}
                        rel={card.isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center border-2 border-accent gap-3 px-6 py-3.5 text-base font-bold text-white rounded-xl shadow-lg transition-all duration-300 group/btn mt-auto hover:shadow-lg"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--${card.theme})) / 0.9, hsl(var(--${card.theme})) / 0.8, hsl(var(--${card.theme})) / 0.7))`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = `linear-gradient(to right, hsl(var(--${card.theme})), hsl(var(--${card.theme})) / 0.9), hsl(var(--${card.theme})) / 0.8))`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = `linear-gradient(to right, hsl(var(--${card.theme})) / 0.9, hsl(var(--${card.theme})) / 0.8, hsl(var(--${card.theme})) / 0.7))`;
                        }}
                      >
                        {card.linkText}
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                      </a>
                    </div>

                    {/* Decorative blur elements */}
                    <div 
                      className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                      style={{ backgroundColor: `hsl(var(--${card.theme}) / 0.3)` }}
                    />
                    <div 
                      className="absolute -top-8 -left-8 w-20 h-20 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" 
                      style={{ backgroundColor: `hsl(var(--${card.theme}) / 0.2)` }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Arrows - Only visible on mobile */}
            {isMobile && (
              <>
                <motion.button
                  onClick={prevAdCard}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 p-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  onClick={nextAdCard}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 p-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}

            {/* Carousel Indicators - Only visible on mobile */}
            {isMobile && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {adCards.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentAdIndex
                        ? "bg-white w-8"
                        : "bg-white/40 w-2.5 hover:bg-white/60"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
        {/* Advertisement Card with Carousel (dynamic) */}

        {/* {isLoading ? (
          <div className="w-full md:w-1/2 max-w-md mx-auto bg-white/30 dark:bg-black/30 backdrop-blur-2xl rounded-3xl flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 shadow-2xl border-0 glassmorphism relative animate-pulse min-h-[400px]">
            <div className="h-10 w-2/3 bg-primary/10 rounded mb-6" />
            <div className="h-56 w-56 bg-primary/10 rounded-2xl mb-4" />
            <div className="h-6 w-1/2 bg-primary/10 rounded mb-2" />
            <div className="h-4 w-1/3 bg-primary/10 rounded mb-2" />
            <div className="h-4 w-2/3 bg-primary/10 rounded mb-2" />
            <div className="h-4 w-1/4 bg-primary/10 rounded mb-2" />
          </div>
        ) : Array.isArray(products) && products.length > 0 ? (
          <AdCarouselCard products={products} />
        ) : (
          <div className="w-full md:w-1/2 max-w-md mx-auto bg-white/30 dark:bg-black/30 backdrop-blur-2xl rounded-3xl flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 shadow-2xl border-0 glassmorphism relative min-h-[400px] text-center text-muted-foreground">
            <h3 className="text-xl font-bold mb-4 text-primary drop-shadow">Matangazo ya Bidhaa</h3>
            <div>Hakuna bidhaa za kutangaza kwa sasa.</div>
          </div>
        )} */}
      </div>
      {/* Overlay gradient with interactive hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background/90 via-primary/30 to-accent/20 pointer-events-none z-0"
        animate={{
          opacity: isHovering ? 0.7 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </section>
  );
}
