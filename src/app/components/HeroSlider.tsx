import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  type CarouselApi 
} from "../components/figma/ui/carousel";

const slides = [
  {
    id: 1,
    title: "រីករាយជាមួយតម្លៃពិសេស",
    subtitle: "Exclusive Student Membership",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000",
    color: "rgba(225, 29, 72, 0.15)", // Red Glow
  },
  {
    id: 2,
    title: "រៀនជាមួយគ្រូឆ្នើម",
    subtitle: "Learn with Top-Rated Mentors",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000",
    color: "rgba(30, 136, 229, 0.15)", // Blue Glow
  }
];

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  // Sync the background blur with the current slide
  React.useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="w-full min-h-[600px] bg-[#050505] py-8 overflow-hidden relative flex flex-col justify-center">
      
      {/* --- THE BACKGROUND BLUR LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic Blurred Image */}
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-1000 scale-110 blur-[80px]"
          style={{ 
            backgroundImage: `url(${slides[current].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* Dark Tint Overlay to keep it premium and not too bright */}
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-3xl" />
        
        {/* Subtle Color Spot Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full transition-colors duration-1000 opacity-30 blur-[120px]"
          style={{ backgroundColor: slides[current].color }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative aspect-[4/5] sm:aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
                  
                  {/* Main Slide Image */}
                  <img 
                    src={slide.image} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt="" 
                  />

                  {/* Glass Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 sm:p-16 flex flex-col justify-end sm:justify-center">
                    {/* Brand Tag */}
                    <div className="flex items-center gap-3 mb-4 bg-black/40 backdrop-blur-xl w-fit px-4 py-1.5 rounded-full border border-white/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#F57C00] shadow-[0_0_8px_#F57C00]"></div>
                      <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">
                        TutorHub Academy
                      </p>
                    </div>
                    
                    <h2 className="text-3xl sm:text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl mb-3">
                      {slide.title}
                    </h2>
                    
                    <p className="text-xs sm:text-lg font-medium text-white/70 uppercase tracking-widest mb-8">
                      {slide.subtitle}
                    </p>

                    <div className="flex items-center gap-4">
                      <button className="bg-[#E11D48] text-white text-[11px] font-black px-8 py-4 rounded-full uppercase tracking-tighter shadow-xl hover:brightness-110 active:scale-95 transition-all">
                        Join Now
                      </button>
                      <button className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[11px] font-black px-8 py-4 rounded-full uppercase tracking-tighter hover:bg-white/20 active:scale-95 transition-all">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Cinematic Toggle Buttons */}
        <div className="flex justify-center mt-12">
          <div className="bg-white/5 backdrop-blur-2xl rounded-full p-1.5 flex w-full max-w-[340px] border border-white/10 shadow-2xl">
          
          </div>
        </div>
      </div>
    </section>
  );
}