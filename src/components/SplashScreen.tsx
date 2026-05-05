import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex flex-col items-center justify-center bg-purple-500 text-white z-50 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.6, duration: 1, delay: 0.2 }}
          className="flex flex-col items-center gap-8 relative z-10"
        >
          <div className="w-40 h-40 bg-white rounded-3xl rounded-tr-md flex items-center justify-center border-b-8 border-r-4 border-purple-700 shadow-2xl">
            <span className="text-purple-500 text-7xl font-black font-mono">C</span>
          </div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-5xl md:text-6xl font-black text-center tracking-tight leading-tight uppercase drop-shadow-lg"
          >
            The TP C Master<br/>Test
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
            className="px-6 py-2 bg-yellow-400 text-yellow-900 rounded-full font-black tracking-widest uppercase shadow-md mt-4"
          >
            500 Questions Edition
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 border-8 border-purple-400 rounded-full opacity-20" 
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-80 h-80 border-[16px] border-purple-600 rounded-full opacity-30" 
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="font-bold tracking-widest text-purple-200 uppercase text-xs">FOUNDED BY AI "CHAT GPT 4.0"</span>
          <div className="h-1 w-24 bg-purple-400 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
