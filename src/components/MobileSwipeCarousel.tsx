import { useEffect, useState, type ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type SwipeSlide = {
  id: string;
  label: string;
  children: ReactNode;
};

type MobileSwipeCarouselProps = {
  slides: SwipeSlide[];
  className?: string;
  showHint?: boolean;
  /** Width of each slide as % of viewport (peek next slide). */
  slideBasis?: string;
};

export function MobileSwipeCarousel({
  slides,
  className,
  showHint = true,
  slideBasis = "92%",
}: MobileSwipeCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (slides.length === 0) return null;

  return (
    <div className={cn("cc-swipe-carousel", className)}>
      {showHint && slides.length > 1 && (
        <p className="cc-swipe-hint mb-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Geser untuk melihat fitur lain →
        </p>
      )}

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false, containScroll: "trimSnaps", dragFree: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 touch-pan-y">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="pl-2"
              style={{ flexBasis: slideBasis, maxWidth: slideBasis }}
            >
              {slide.children}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slides.length > 1 && (
        <>
          <div
            className="mt-3 flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Navigasi fitur"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={slide.label}
                onClick={() => api?.scrollTo(i)}
                className={cn("cc-swipe-dot", i === current && "cc-swipe-dot--active")}
              />
            ))}
          </div>
          <p className="mt-1.5 text-center text-xs font-semibold text-foreground/80">
            {slides[current]?.label}
          </p>
        </>
      )}
    </div>
  );
}
