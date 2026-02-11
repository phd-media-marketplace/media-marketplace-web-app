import { motion, AnimatePresence } from "framer-motion";
import { Tv, Radio, MapPin, TrendingUp, Eye, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroPanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Powerful, Unified ",
      subtitle: "Media Advertising",
      description: "Manage your TV, Radio and Out-of-Home campaigns in one place. Track performance, optimize budgets and maximize your reach across all channels."
    },
    {
      title: "Real-Time",
      subtitle: "Performance Tracking",
      description: "Monitor campaign metrics instantly with comprehensive analytics. Make data-driven decisions and optimize your media spend for maximum ROI."
    },
    {
      title: "Seamless",
      subtitle: "Multi-Channel Management",
      description: "Plan, execute and measure campaigns across multiple media channels. Streamline your workflow with our integrated platform."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  
  return (
    <div className="relative w-full h-full bg-linear-to-br from-[#1a0633] via-[#2D0A4E] to-[#3d1166] overflow-hidden flex flex-col justify-between p-8 lg:p-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 rounded-full bg-[#C8F526] opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-100 h-100 rounded-full bg-[#C8F526] opacity-[0.03] blur-3xl" />
        <div className="absolute top-[30%] left-[20%] w-50 h-50 rounded-full bg-purple-400 opacity-[0.05] blur-2xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,245,38,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Logo area */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#C8F526] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#2D0A4E]" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">PHD Media Marketplace</span>
        </div>
      </div>

      {/* Floating cards */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="relative w-full max-w-95 h-80">
          {/* Main card - Campaign Performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute top-4 left-0 right-0 mx-auto w-[90%] bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">TV Campaign</p>
                <p className="text-white text-2xl font-bold mt-0.5">$124,908</p>
              </div>
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">OOH Spend</p>
                <p className="text-white text-2xl font-bold mt-0.5">$41,028</p>
              </div>
            </div>
            {/* Mini chart bars */}
            <div className="flex items-end gap-1.5 h-16 mt-2">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                  className="flex-1 rounded-sm"
                  style={{
                    background: i >= 9 ? '#C8F526' : 'rgba(200,245,38,0.25)',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/30 text-[10px]">Jan</span>
              <span className="text-white/30 text-[10px]">Jun</span>
              <span className="text-white/30 text-[10px]">Dec</span>
            </div>
          </motion.div>

          {/* Floating badge - Reach */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-12 -left-2 bg-white rounded-xl px-4 py-3 shadow-2xl"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C8F526] flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#2D0A4E]" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-medium">Total Reach</p>
                <p className="text-gray-900 text-sm font-bold">2.4M Impressions</p>
              </div>
            </div>
          </motion.div>

          {/* Floating badge - Growth */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-4 -right-2 bg-[#C8F526] rounded-xl px-4 py-3 shadow-2xl"
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-[#2D0A4E]" />
              <div>
                <p className="text-[#2D0A4E]/60 text-[10px] font-semibold">ROI Growth</p>
                <p className="text-[#2D0A4E] text-sm font-bold">+34.2%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

        {/* Bottom content - Carousel */}
        <div className="relative z-10">
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-4 max-w-2xl min-h-45">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight text-center">
                          {slides[currentSlide].title}<br />{slides[currentSlide].subtitle}
                        </h2>
                        <p className="text-white/50 text-sm mt-3 max-w-85 leading-relaxed text-center">
                          {slides[currentSlide].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                </div>
                {/* Dots indicator */}
                <div className="flex gap-2 mt-6">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-6 h-1.5 bg-[#C8F526]' 
                          : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
            </div>
        </div>

      {/* Media type icons floating */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] right-8 w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center"
      >
        <Tv className="w-4 h-4 text-[#C8F526]/60" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[45%] right-12 w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center"
      >
        <Radio className="w-4 h-4 text-[#C8F526]/60" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[35%] left-8 w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center"
      >
        <MapPin className="w-4 h-4 text-[#C8F526]/60" />
      </motion.div>
    </div>
  );
}