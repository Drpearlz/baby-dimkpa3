import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

interface FloatingHeartProps {
  index: number;
  baseDelay?: number;
}

export const FloatingHeart: React.FC<FloatingHeartProps> = ({ index, baseDelay = 0 }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Generate position across the full width
  const xOffset = (seededRandom(index) * 40); // -40% to +40% of container width
  const duration = 2 + seededRandom(index + 1) * 2;
  const delay = baseDelay + seededRandom(index + 2);

  return (
    <motion.div
      className="absolute text-2xl"
      initial={{ 
        y: 100,
        x: xOffset + '%', // Use percentage for responsive positioning
        opacity: 0 
      }}
      animate={{ 
        y: -100,
        x: xOffset + '%',
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      ❤️
    </motion.div>
  );
};

export const FloatingHeartsContainer: React.FC = () => {
  return (
    <div >
      <div >
        {Array.from({ length: 7 }).map((_, i) => (
          <FloatingHeart key={i} index={i} baseDelay={i * 0.2} />
        ))}
      </div>
    </div>
  );
};