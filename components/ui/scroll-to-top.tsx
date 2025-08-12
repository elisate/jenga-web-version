"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useMounted } from "@/lib/hooks";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const isMounted = useMounted();

  useEffect(() => {
    const toggleVisibility = () => {
      // If user scrolls down more than 300px, show button
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Don't render anything until component is mounted on client
  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ opacity: 0.3 }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
