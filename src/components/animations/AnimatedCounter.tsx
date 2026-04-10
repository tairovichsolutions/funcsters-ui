'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

// ----------------------------------------------------------------------------
// 1. The Core Counter Component (Only handles the number animation)
// ----------------------------------------------------------------------------
interface AnimatedCounterProps {
  to: number;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ to, duration = 2.5 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { 
        duration: duration, 
        ease: "easeOut" 
      });
      return () => controls.stop();
    }
  }, [count, inView, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

// ----------------------------------------------------------------------------
// 2. The Stat Card Component (Receives data from parent, handles fade-up)
// ----------------------------------------------------------------------------
interface StatCardProps {
  target: number;
  suffix: string;
  label: string;
  index: number; // Used to stagger the animation delay
}

export const StatCard: React.FC<StatCardProps> = ({ target, suffix, label, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="bg-white rounded-[20px] px-4 py-6 flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="text-xl font-semibold text-[#0F172A] mb-2 tracking-tight flex items-center">
        {/* Pass the target number down to the counter */}
        <AnimatedCounter to={target} />
        <span>{suffix}</span>
      </div>
      <p className="text-xs md:text-base font-semibold text-neutral-05 uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
};

// ----------------------------------------------------------------------------
// 3. The Parent Component (Holds the data and maps over it)
// ----------------------------------------------------------------------------
export default function StatsSection() {
  // All the data lives here in the parent
  const statsData = [
    { target: 10, suffix: 'K+', label: 'LOGICS SOLVED' },
    { target: 99, suffix: '%', label: 'CODE INTUITION' },
    { target: 24, suffix: '/7', label: 'ACTIVE ASSISTANT' },
  ];

  return (
    <div className="bg-[#F4F6F8] min-h-[300px] flex items-center justify-center p-8 font-sans antialiased">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatCard 
            key={index}
            index={index}
            target={stat.target}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
}