import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const images = [
  "https://picsum.photos/seed/youth-learning/1200/1200",
  "https://picsum.photos/seed/student-success/1200/1200",
  "https://picsum.photos/seed/education-youth/1200/1200",
  "https://picsum.photos/seed/happy-students/1200/1200",
];

interface AuthSliderProps {
  title: string;
  subtitle: string;
}

export default function AuthSlider({ title, subtitle }: AuthSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex md:w-1/2 bg-brand items-center justify-center p-12 relative overflow-hidden">
      {/* Image Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      {/* Primary Color Overlay (Slightly overlaid) */}
      <div className="absolute inset-0 bg-brand/30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-white max-w-md">
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold mb-6 font-display leading-tight">{title}</h2>
          <p className="text-xl opacity-90 leading-relaxed font-medium">{subtitle}</p>
        </motion.div>
        
        {/* Slider Indicators */}
        <div className="flex gap-2 mt-12">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
