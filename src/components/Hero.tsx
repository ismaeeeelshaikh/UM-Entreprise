"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const heroImages = ["/hero-1.png", "/hero-2.png", "/hero-3.png"];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-32 md:py-48 lg:py-56">
      {/* Animated Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {/* Fallback using standard img tag if Next/Image is having trouble */}
            <img
              src={heroImages[index]}
              alt="Hero Background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Overlay to ensure text readability - lighter for better visibility */}
            <div className="absolute inset-0 bg-white/40 md:bg-white/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center gap-6 md:gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-900 backdrop-blur-md border border-slate-200/50 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-slate-800">Premium Custom Gifts</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-slate-900 drop-shadow-sm"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary to-slate-900">
              Crafting Memories,
            </span> <br className="hidden sm:inline" />
            One Gift at a Time.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[700px] text-lg text-slate-700 sm:text-xl md:text-2xl/relaxed font-medium"
          >
            Unique, personalized gifts defined by elegance.
            Wallets, pens, keychains, and more—made just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
          >
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/products">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50">
              <Link href="/customize">Corporate Gifts</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
