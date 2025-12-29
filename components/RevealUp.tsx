"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type RevealUpProps = {
  children: React.ReactNode;
  delay?: number;
};

export default function RevealUp({ children, delay = 0 }: RevealUpProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
