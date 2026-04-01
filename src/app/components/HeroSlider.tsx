import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "../components/figma/ui/carousel";
import { cn } from "@/lib/utils"; 
import { ArrowRight, GraduationCap, Zap, Star } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "រៀនជាមួយគ្រូឆ្នើម",
    image: "https://illustrations.popsy.co/amber/student-going-to-school.svg", 
    bgColor: "bg-blue-50/80",
    accent: "bg-blue-500",
    icon: <GraduationCap size={12} />
  },
  {
    id: 2,
    title: "ពង្រឹងសមត្ថភាព",
    image: "https://illustrations.popsy.co/amber/digital-nomad.svg",
    bgColor: "bg-orange-50/80",
    accent: "bg-orange-500",
    icon: <Zap size={12} />
  },
  {
    id: 3,
    title: "សម្រេចគោលដៅ",
    image: "https://illustrations.popsy.co/amber/creative-work.svg",
    bgColor: "bg-purple-50/80",
    accent: "bg-purple-500",
    icon: <Star size={12} />
  },
  {
    id: 4,
    title: "បច្ចេកវិទ្យាថ្មី",
    image: "https://illustrations.popsy.co/amber/keynote-presentation.svg",
    bgColor: "bg-emerald-50/80",
    accent: "bg-emerald-500",
    icon: <Zap size={12} />
  }
];

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Auto-run configuration: 3 seconds per slide, doesn't stop on click
  const plugin = React.useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: false 
    })
  );

  React.useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full py-4 select-none">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <Carousel 
          setApi={setApi} 
          plugins={[plugin.current]} 
          opts={{ align: "start", loop: true }} 
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                
                {/* COMPACT CARD */}
                <div className={cn(
                  "group relative aspect-[0.95/1] overflow-hidden rounded-[2rem] border border-slate-100/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
                  slide.bgColor
                )}>
                  
                  {/* Static Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm", slide.accent)}>
                      {slide.icon}
                    </div>
                  </div>

                  {/* 3D Character (Floating Animation) */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 pb-16">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-contain animate-float"
                    />
                  </div>

                  {/* Always-Visible Auto Title */}
                  <div className="absolute inset-x-3 bottom-3">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white shadow-sm transition-all group-hover:bg-white">
                      <div className="flex flex-col min-w-0">
                        <h3 className="text-[11px] font-black text-slate-900 truncate tracking-tight">
                          {slide.title}
                        </h3>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Expert Tutor
                        </span>
                      </div>
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>

                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dynamic Progress Indicator */}
        <div className="mt-6 flex gap-1.5 justify-center items-center">
          {slides.map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-700",
                current === i ? "w-6 bg-slate-900" : "w-1.5 bg-slate-200"
              )} 
            />
          ))}
        </div>
      </div>

      {/* Global CSS for 3D Floating Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}