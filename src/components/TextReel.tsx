import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface TextReelProps {
  logs: string[];
  className?: string;
}

export function TextReel({ logs, className }: TextReelProps) {
  return (
    <div className={cn("relative overflow-hidden w-full flex flex-col justify-end", className)}>
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      <AnimatePresence initial={false}>
        {logs.map((log, index) => (
          <motion.div
            key={log + index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="text-white font-mono break-all"
            dangerouslySetInnerHTML={{ __html: log }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
