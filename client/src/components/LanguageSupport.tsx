"use client";

import { motion } from "framer-motion";
import { Parallax } from "@/components/Parallax";

const languages = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "Python", color: "#3776AB" },
  { name: "Go", color: "#00ADD8" },
  { name: "Rust", color: "#DEA584" },
  { name: "Java", color: "#007396" },
  { name: "C++", color: "#00599C" },
  { name: "Swift", color: "#F05138" },
  { name: "Kotlin", color: "#7F52FF" },
  { name: "Ruby", color: "#CC342D" },
  { name: "PHP", color: "#777BB4" },
];

const CarouselRow = ({ 
  items, 
  direction = "left", 
  speed = 25 
}: { 
  items: typeof languages, 
  direction?: "left" | "right", 
  speed?: number 
}) => {
  return (
    <div className="relative flex overflow-hidden py-4">
      <div 
        className="relative flex items-center min-w-full overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <motion.div 
          className="flex gap-16 items-center whitespace-nowrap min-w-full"
          initial={{ x: direction === "left" ? "0%" : "-25%" }}
          animate={{ x: direction === "left" ? "-25%" : "0%" }}
          transition={{ 
            ease: "linear", 
            duration: speed, 
            repeat: Infinity 
          }}
        >
          {[...items, ...items, ...items, ...items].map((lang, index) => (
            <motion.div
              key={`${lang.name}-${index}-${direction}`}
              whileHover={{ 
                scale: 1.1, 
                opacity: 1,
                color: lang.color,
                transition: { duration: 0.2 }
              }}
              className="flex flex-col items-center gap-2 cursor-default group opacity-70 hover:opacity-100 transition-opacity"
            >
              <div 
                className="text-2xl font-bold transition-colors duration-300 group-hover:text-[var(--hover-color)]"
                style={{ "--hover-color": lang.color } as React.CSSProperties}
              >
                {lang.name}
              </div>
              <div 
                className="h-1 w-1 rounded-full bg-current opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                style={{ color: lang.color }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};



export function LanguageSupport() {
  return (
    <section className="bg-muted/10 py-16 border-y border-border space-y-4">
      <div className="w-[95%] max-w-[2400px] mx-auto px-6 md:px-12 relative overflow-hidden space-y-8">
        <Parallax offset={30}>
        <div className="text-center mb-8">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-medium text-muted-foreground"
          >
            Production-grade snippets for every stack
          </motion.h3>
        </div>
        </Parallax>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          <motion.div variants={fadeInUp}>
            <CarouselRow items={languages} direction="left" speed={30} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <CarouselRow items={[...languages].reverse()} direction="right" speed={35} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <CarouselRow items={languages} direction="left" speed={40} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
