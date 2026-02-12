"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  clamp?: boolean; // Whether to clamp the value so it doesn't move indefinitely
}

export function Parallax({ children, offset = 50, className = "", clamp = false }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create a smooth parallax effect
  // We map the scroll progress (0 to 1) to a Y value (-offset to offset)
  // This means as you scroll down, the element moves UP relative to its container (or down if offset is negative)
  const yRange = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  
  // Add a spring for smoother physics
  const y = useSpring(yRange, { stiffness: 400, damping: 90 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
}
