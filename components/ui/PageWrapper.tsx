"use client";
import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col min-h-full">
      {children}
    </motion.div>
  );
}

export function FadeItem({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div variants={item} className={className} style={style}>
      {children}
    </motion.div>
  );
}
