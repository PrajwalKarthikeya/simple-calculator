import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';
import { cn } from '../lib/utils';

export function DraggableMarquee({ text, speed = 5, className }: { text: string; speed?: number; className?: string }) {
  const baseX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useAnimationFrame((t, delta) => {
    let moveBy = speed * (delta / 1000);
    // Move left continuously
    baseX.set(baseX.get() - moveBy * 50);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div className={cn("overflow-hidden flex bg-red-600/20 text-red-500 py-1 font-bold whitespace-nowrap cursor-grab active:cursor-grabbing", className)}>
      <motion.div 
        className="flex whitespace-nowrap"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDrag={(e, info) => {
          baseX.set(baseX.get() + info.delta.x);
        }}
      >
        <span className="block px-8">{text}</span>
        <span className="block px-8">{text}</span>
        <span className="block px-8">{text}</span>
        <span className="block px-8">{text}</span>
      </motion.div>
    </div>
  );
}
