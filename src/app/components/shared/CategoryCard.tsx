import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  image: string;
}

export function CategoryCard({ title, subtitle, image }: CategoryCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="relative min-w-[200px] md:min-w-[240px] h-[140px] rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0 shadow-sm border border-white/10"
    >
      {/* Background Image */}
      <img 
        src={image} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt={title}
      />
      
      {/* Optimized Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Top Badge: Compact styling */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-black text-slate-800 uppercase tracking-tight shadow-sm">
        {subtitle}
      </div>

      {/* Bottom Title: Tighter typography */}
      <div className="absolute bottom-3 left-3 right-3">
        <h4 className="text-white font-black text-[16px] leading-tight tracking-tight drop-shadow-md group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
      </div>
    </motion.div>
  );
}