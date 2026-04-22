import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const phoneNumber = "255776986840"; // Namba yako
  const message = "Habari, ninaomba maelezo zaidi kuhusu ratiba za vyombo.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Tooltip ndogo inayotokea pembeni */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl hidden md:block"
      >
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">
          Tuulize chochote
        </p>
      </motion.div>

      {/* Kitufe chenyewe cha WhatsApp */}
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        {/* Animated Ping - Mng'ao wa kijani unaocheza nyuma */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40" />
        
        {/* Main Icon Button */}
        <div className="relative bg-[#25D366] p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] border border-white/20">
          <MessageCircle className="w-8 h-8 text-white fill-white" />
        </div>

        {/* Badge ya Notification (Optional - inafanya ionekane ina ujumbe) */}
        {/* <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" /> */}
      </motion.button>
    </div>
  );
}