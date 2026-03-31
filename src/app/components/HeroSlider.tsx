import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  type CarouselApi 
} from "../components/figma/ui/carousel";
import { cn } from "@/lib/utils"; 
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { id: 1, image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200", title: "Social Learning" },
  { id: 2, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200", title: "Meta Quest VR" },
  { id: 3, image: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1200", title: "WhatsApp Integration" },
  { id: 4, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200", title: "Collaboration" },
];

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ 
            align: "center", // This keeps the active item in the middle
            loop: true, 
            duration: 30 
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 flex items-center">
            {slides.map((slide, index) => {
              const isActive = current === index;
              return (
                <CarouselItem 
                  key={slide.id} 
                  // This "basis" creates the effect of seeing the next/prev slides on the edges
                  className="pl-4 basis-[75%] sm:basis-[55%] md:basis-[45%] lg:basis-[35%]"
                >
                  <div className={cn(
                    "relative transition-all duration-700 ease-in-out overflow-hidden rounded-[2.5rem]",
                    // Active slide is taller and fully opaque
                    // Inactive slides are shorter (scale-90) and faded
                    isActive 
                      ? "aspect-[4/5] scale-100 opacity-100 shadow-2xl" 
                      : "aspect-[4/5] scale-[0.85] opacity-40 blur-[1px]"
                  )}>
                    <img 
                      src={slide.image} 
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={slide.title} 
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Controls positioned relative to the center card */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 sm:px-[15%] pointer-events-none">
            <button 
              onClick={() => api?.scrollPrev()}
              className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto hover:bg-slate-50 transition-all border"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => api?.scrollNext()}
              className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto hover:bg-slate-50 transition-all border"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </Carousel>

        {/* Text Caption below the center slide */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 font-medium text-sm lg:text-base">
            {slides[current].title}
          </p>
        </div>
      </div>
    </section>
  );
}