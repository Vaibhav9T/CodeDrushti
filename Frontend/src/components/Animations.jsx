// import { motion } from 'framer-motion';
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Page Transition
export const PageWrapper = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export const TactileCard = ({ children, onClick, className }) => {
  // Track mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Add a spring physics bounce to the movement so it isn't rigid
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Map the mouse position to 3D rotation angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate percentage from the center of the card
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Snap back to flat when the mouse leaves
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        scale: 1.02, 
        zIndex: 20,
      }}
      whileTap={{ scale: 0.95 }}
      // 'perspective' makes the 3D tilt look realistic
      className={`relative perspective-[1000px] cursor-pointer ${className}`}
    >
      {/* TranslateZ pushes the content "off" the card background, 
        giving it a massive depth effect when it tilts 
      */}
      <div 
        style={{ transform: "translateZ(40px)" }} 
        className="w-full h-full pointer-events-none"
      >
        {children}
      </div>
      
      {/* Subtle glow effect behind the card on hover */}
      <motion.div 
        className="absolute inset-0 rounded-2xl bg-indigo-500/0 -z-10 blur-xl transition-colors duration-300 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/10"
      />
    </motion.div>
  );
};

// Staggered List Container
export const StaggerContainer = ({ children, className }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
      }
    }}
    initial="hidden"
    animate="show"
    className={className}
  >
    {children}
  </motion.div>
);

// Staggered List Item
export const StaggerItem = ({ children, className }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 15 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SurfableCarousel = ({ children }) => {
  return (
    <div className="w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing">
      <motion.div 
        drag="x" 
        // This limits how far they can drag it off-screen
        dragConstraints={{ left: -800, right: 0 }} 
        // This adds "rubber band" physics when they pull too far
        dragElastic={0.2}
        className="flex gap-6 w-max"
      >
        {children}
      </motion.div>
    </div>
  );
};

export const AuroraFeatureCard = ({ title, description, icon: Icon, children }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group overflow-hidden rounded-[2rem] border border-gray-200/50 dark:border-white/10 shadow-xl cursor-pointer"
    >
      {/* THE MOVING COLORS LAYER 
        We use a background size of 200% and pan it left to right.
      */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-60 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity duration-500 animate-gradient-pan"
        style={{
          backgroundImage: 'linear-gradient(to right, theme("colors.indigo.500"), theme("colors.purple.500"), theme("colors.emerald.500"), theme("colors.indigo.500"))',
          backgroundSize: '200% 200%'
        }}
      />

      {/* FROSTED GLASS OVERLAY 
        This prevents the bright moving colors from making the text unreadable
      */}
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl" />

      {/* CARD CONTENT */}
      <div className="relative p-8 md:p-10 z-10 flex flex-col h-full">
        <div className="inline-flex p-4 rounded-2xl mb-6 bg-white/80 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 shadow-sm backdrop-blur-md w-fit border border-white/20">
          <Icon size={28} />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 flex-1">
          {description}
        </p>

        {children}
      </div>
    </motion.div>
  );
};

export const FloatingColorsCard = ({ title, description, icon: Icon, children }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-[2rem] border border-gray-200/50 dark:border-white/10 shadow-xl group cursor-pointer bg-white dark:bg-slate-900"
    >
      
      {/* 1. THE FLOATING COLORS (Strictly confined inside the card) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-70 group-hover:opacity-80 transition-opacity duration-500">
        
        {/* Top Left Orb */}
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px]"
        />
        
        {/* Bottom Right Orb */}
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[90px]"
        />
        
        {/* Center Drifting Orb */}
        <motion.div 
          animate={{ x: [-40, 50, -40], y: [40, -40, 40], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[70px]"
        />

      </div>

      {/* 2. THE FROSTED GLASS (Keeps the text highly readable) */}
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/50 backdrop-blur-[40px]" />

      {/* 3. THE CARD CONTENT */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
        <div className="inline-flex p-4 rounded-2xl mb-6 bg-white/80 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 shadow-sm backdrop-blur-md w-fit border border-white/20">
          <Icon size={28} />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 flex-1">
          {description}
        </p>

        {children}
      </div>
    </motion.div>
  );
};