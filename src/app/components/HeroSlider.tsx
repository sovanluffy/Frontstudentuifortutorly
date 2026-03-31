import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  type CarouselApi 
} from "../components/figma/ui/carousel";
import { cn } from "@/lib/utils"; 
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "រីករាយជាមួយតម្លៃពិសេស",
    subtitle: "Exclusive Student Membership",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000",
    color: "rgba(59, 130, 246, 0.15)", 
  },
  {
    id: 2,
    title: "រៀនជាមួយគ្រូឆ្នើម",
    subtitle: "Learn with Top-Rated Mentors",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000",
    color: "rgba(16, 185, 129, 0.15)", 
  },
  {
    id: 3,
    title: "បច្ចេកវិទ្យាថ្មីៗ",
    subtitle: "Master Modern Technology",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
    color: "rgba(245, 124, 0, 0.15)", 
  }
];

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Clean Autoplay Config: 5 seconds delay, smooth transition
  const plugin = React.useRef(
    Autoplay({ 
      delay: 5000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true 
    })
  );

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <section className="relative w-full min-h-[65vh] sm:min-h-[85vh] flex flex-col justify-center py-5 lg:py-5 overflow-hidden bg-[#fafafa]">
      
      {/* --- SOFT AMBIENT GLOW --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10 transition-opacity duration-1000 blur-[100px]"
          style={{ 
            backgroundImage: `radial-gradient(circle at center, ${slides[current].color}, transparent)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ 
            align: "center", 
            loop: true,
            duration: 50 // Makes the manual swipe feel "lighter" and cleaner
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-8 md:-ml-12 items-center">
            {slides.map((slide, index) => {
              const isActive = current === index;
              return (
                <CarouselItem 
                  key={slide.id} 
                  className="pl-4 sm:pl-8 md:pl-12 basis-[92%] sm:basis-[85%] md:basis-[80%] lg:basis-[70%] xl:basis-[60%] 2xl:basis-[55%]"
                >
                  <div 
                    className={cn(
                      "relative overflow-hidden transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1)",
                      "aspect-[0.9/1] sm:aspect-[1.5/1] md:aspect-[16/8] lg:aspect-[21/9]",
                      "rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem]",
                      "border border-black/[0.03] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]",
                      isActive ? "scale-100 opacity-100" : "scale-[0.92] opacity-30 blur-[2px]"
                    )}
                  >
                    <img 
                      src={slide.image} 
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out",
                        isActive ? "scale-100" : "scale-110"
                      )}
                      alt={slide.title} 
                    />
                    
                    {/* Clean Minimalist Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:from-white lg:via-white/20 lg:to-transparent" />

                    <div className={cn(
                      "absolute inset-0 p-8 sm:p-14 lg:p-20 flex flex-col justify-end transition-all duration-1000 delay-300",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    )}>
                      
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 lg:bg-slate-900/5 backdrop-blur-md text-[10px] md:text-xs text-white lg:text-slate-900 font-bold uppercase tracking-[0.2em]">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Exclusive
                        </span>
                      </div>

                      <h2 className={cn(
                        "font-black leading-[1.1] mb-6 md:mb-10 max-w-4xl tracking-tight",
                        "text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-[84px]",
                        "text-white lg:text-slate-950"
                      )}>
                        {slide.title}
                      </h2>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <button className="h-14 md:h-16 px-10 bg-blue-600 lg:bg-slate-950 text-white rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95">
                          <span className="text-xs font-bold uppercase tracking-widest">Get Started</span>
                          <Play size={14} fill="currentColor" />
                        </button>
                        
                        <p className="text-[11px] md:text-sm font-medium text-white/70 lg:text-slate-400 uppercase tracking-[0.25em] max-w-xs leading-relaxed">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Minimalist Nav Controls */}
          <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-12 pointer-events-none">
             <NavButton onClick={() => api?.scrollPrev()} icon={<ChevronLeft size={28} className="text-slate-400 group-hover:text-slate-950" />} />
             <NavButton onClick={() => api?.scrollNext()} icon={<ChevronRight size={28} className="text-slate-400 group-hover:text-slate-950" />} />
          </div>
        </Carousel>

        {/* Cinematic Progress Bar (Clean alternative to dots) */}
        <div className="flex justify-center items-center gap-4 mt-12 md:mt-16">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="relative h-1 w-12 md:w-20 bg-slate-200 rounded-full overflow-hidden"
            >
              {current === index && (
                <div 
                  className="absolute inset-0 bg-slate-950 origin-left"
                  style={{ 
                    animation: 'progress 5000ms linear forwards' 
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}} />
    </section>
  );
}

function NavButton({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="group h-14 w-14 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 flex items-center justify-center pointer-events-auto hover:bg-white hover:scale-110 transition-all duration-500 shadow-sm"
    >
      {icon}
    </button>
  );
}