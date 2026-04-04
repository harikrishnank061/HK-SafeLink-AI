"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HKLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Energy Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--primary)_0%,_transparent_70%)] opacity-10 animate-pulse" />
      </div>

      {/* The Shockwave Portal */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Repeating Shockwaves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: [1, 4],
              opacity: [0.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              delay: i * 0.8,
              ease: "easeOut"
            }}
            className="absolute inset-0 border-[0.5px] border-primary/40 rounded-full"
          />
        ))}

        {/* The Core - The Heart of the AI */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            filter: ["brightness(1) blur(0px)", "brightness(1.5) blur(1px)", "brightness(1) blur(0px)"]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.25, 
            ease: "easeInOut" 
          }}
          className="relative z-50 w-48 h-48 flex items-center justify-center"
        >
          {/* Logo with Magnetic Aura */}
          <div className="relative p-12 bg-white/[0.02] backdrop-blur-3xl rounded-full border border-white/5 shadow-2xl overflow-hidden group">
             {/* Internal Energy Swirl */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent opacity-40"
             />
             
             <img 
               src="/logo.png" 
               alt="HK Logo" 
               className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(var(--primary),0.6)]"
             />
          </div>
        </motion.div>

        {/* Floating Particles flowing into the logo */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: (Math.random() - 0.5) * 600, 
              y: (Math.random() - 0.5) * 600, 
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: 0, 
              y: 0, 
              opacity: [0, 0.5, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + Math.random() * 2, 
              delay: Math.random() * 2,
              ease: "circIn"
            }}
            className="absolute w-1 h-1 bg-primary rounded-full glow"
          />
        ))}
      </div>

      {/* Minimalist Innovation Status */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 flex flex-col items-center gap-4"
      >
        <div className="h-[2px] w-48 bg-white/5 rounded-full relative overflow-hidden">
           <motion.div 
             animate={{ x: [-200, 200] }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
             className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
           />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-primary/60 animate-pulse">
           Initializing SafeLink AI Core
        </span>
      </motion.div>
    </div>
  );
}



