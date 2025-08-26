import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Clock, MapPin, Ship } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const images = [
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//ferrydaw.jpg',
      caption: 'Pwani ya Utende'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//openart-image_qq2r6JCc_1743214522482_raw.jpg',
      caption: 'Mto wa Rufiji'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg',
      caption: 'Meli ya Kisasa'
    }
  ]

  // Example product data for the ad carousel
  const products = [
    {
      name: 'Mafia T-shirt',
      price: 'TZS 25,000',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Safari Hat',
      price: 'TZS 15,000',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Beach Bag',
      price: 'TZS 30,000',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
    }
  ];
  const [productIndex, setProductIndex] = useState(0);

  // Carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const scrollToContent = () => {
    const nextSection = document.getElementById('schedule')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden pt-16 sm:pt-0 pb-8 sm:pb-0 bg-gradient-to-br from-background via-primary/10 to-accent/10">
      {/* Background images with parallax effect */}
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${image.url}')`,
            filter: 'brightness(0.6)'
          }}
          animate={{
            scale: index === currentImageIndex ? 1.05 : 1,
          }}
          transition={{
            duration: 6,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Content with improved layout and theme correspondence */}
      <div className="container mx-auto px-2 sm:px-4 relative z-10 flex flex-col md:flex-row items-center justify-center h-full gap-8 md:gap-12">
        {/* Main Hero Card */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full md:w-1/2 flex flex-col items-stretch justify-center text-center max-w-5xl mx-auto gap-4 md:gap-12 md:rounded-3xl md:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Redesigned Hero Content: Modern, minimal, glassmorphic, mobile-first */}
          <div className="w-full max-w-lg mx-auto mb-8 bg-white/20 dark:bg-black/30 backdrop-blur-3xl rounded-3xl flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 relative shadow-2xl border-0" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)' }}>
            <motion.div
              variants={itemVariants}
              className="mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentImageIndex}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-background/60 backdrop-blur text-primary text-xs font-semibold shadow border border-primary/10">
                {images[currentImageIndex].caption}
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="relative mb-2 w-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground drop-shadow-xl tracking-tight font-display mb-2">
                Mafiaferry
              </h1>
              <h2 className="text-lg sm:text-2xl font-semibold text-foreground/90 font-display mb-3 drop-shadow-md tracking-tight">
                Habari za Usafiri wa Majini Kisiwa cha Mafia Online
              </h2>
              <p className="text-base sm:text-lg text-foreground/80 max-w-md mx-auto font-medium mb-6">
                Taarifa za Vyombo vya Usafiri wa Majini Kati ya Mafia na Bara
              </p>
              {/* Cool animated anchor link instead of button/feature list */}
              <a
                href="#schedule"
                className="inline-block w-full sm:w-auto text-center px-8 py-3 rounded-full text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary-foreground text-white shadow-xl hover:scale-105 transition-transform duration-300 animate-gradient-x"
                style={{ backgroundSize: '200% 200%', animation: 'gradient-x 3s ease-in-out infinite' }}
              >
                Angalia Ratiba na Huduma
              </a>
              {/* Animated accent circles for depth */}
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary/30 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.13, 0.22, 0.13],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.18, 0.10, 0.18],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
        {/* Advertisement Card with Carousel */}
        <div className="w-full md:w-1/2 max-w-md mx-auto bg-white/30 dark:bg-black/30 backdrop-blur-2xl rounded-3xl flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 shadow-2xl border-0 glassmorphism relative">
          <h3 className="text-xl font-bold mb-4 text-primary drop-shadow">Matangazo ya Bidhaa</h3>
          <div className="relative w-full flex flex-col items-center">
            <img
              src={products[productIndex].image}
              alt={products[productIndex].name}
              className="w-40 h-40 object-cover rounded-xl border border-primary/10 shadow mb-4 bg-background/60"
            />
            <div className="text-lg font-semibold text-foreground mb-1">{products[productIndex].name}</div>
            <div className="text-primary text-base font-bold mb-2">{products[productIndex].price}</div>
            <div className="flex gap-2 mt-2">
              <button
                aria-label="Previous product"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-sm transition-all duration-150"
                onClick={() => setProductIndex((productIndex - 1 + products.length) % products.length)}
              >&#8592;</button>
              <button
                aria-label="Next product"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-sm transition-all duration-150"
                onClick={() => setProductIndex((productIndex + 1) % products.length)}
              >&#8594;</button>
            </div>
            <div className="flex gap-1 mt-3 justify-center">
              {products.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-2 h-2 rounded-full ${idx === productIndex ? 'bg-primary' : 'bg-primary/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Overlay gradient with interactive hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background/90 via-primary/30 to-accent/20 pointer-events-none z-0"
        animate={{
          opacity: isHovering ? 0.7 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </section>
  )
}