import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeTransitionProps {
  isAnimating: boolean;
  newTheme: 'light' | 'dark';
  clickX?: number;
  clickY?: number;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({ 
  isAnimating, 
  newTheme, 
  clickX = 50, 
  clickY = 50 
}) => {
  return (
    <AnimatePresence>
      {isAnimating && (
        <>
          {/* Expanding circle effect */}
          <motion.div
            initial={{ 
              clipPath: `circle(0% at ${clickX}% ${clickY}%)`,
            }}
            animate={{ 
              clipPath: `circle(150% at ${clickX}% ${clickY}%)`,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="fixed inset-0 z-[60] pointer-events-none"
          >
            <div 
              className="absolute inset-0"
              style={{
                background: newTheme === 'light' 
                  ? 'radial-gradient(circle at var(--click-x, 50%) var(--click-y, 50%), rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)'
                  : 'radial-gradient(circle at var(--click-x, 50%) var(--click-y, 50%), rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.05) 40%, transparent 70%)',
                '--click-x': `${clickX}%`,
                '--click-y': `${clickY}%`,
              } as React.CSSProperties}
            />
          </motion.div>
          
          {/* Subtle screen flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              times: [0, 0.5, 1]
            }}
            className={`fixed inset-0 z-[59] pointer-events-none ${
              newTheme === 'light' ? 'bg-white' : 'bg-slate-950'
            }`}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemeTransition;