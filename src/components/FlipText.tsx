import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function FlipText({ children, className }: { children: React.ReactNode; className?: string }) {
  const text = String(children);
  
  return (
    <div className={cn("flex space-x-[1px] overflow-hidden", className)}>
      <AnimatePresence mode="popLayout">
        {text.split('').map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial={{ y: '100%', opacity: 0, rotateX: -90 }}
            animate={{ y: '0%', opacity: 1, rotateX: 0 }}
            exit={{ y: '-100%', opacity: 0, rotateX: 90 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 1,
            }}
            className="inline-block origin-center"
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
