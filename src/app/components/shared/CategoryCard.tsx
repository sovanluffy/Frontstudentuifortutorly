import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  image: string;
}

export function CategoryCard({ title, subtitle, image }: CategoryCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative min-w-[240px] md:min-w-[280px] h-[160px] rounded-[24px] overflow-hidden cursor-pointer group flex-shrink-0 shadow-sm"
    >
      <img 
        src={image} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-800 uppercase tracking-wider">
        {subtitle}
      </div>

      <div className="absolute bottom-4 left-4">
        <h4 className="text-white font-bold text-xl leading-tight tracking-tight drop-shadow-md">
          {title}
        </h4>
      </div>
    </motion.div>
  );
}