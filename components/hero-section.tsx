"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  { src: "/slides/slide-1.jpg", alt: "Damien Hirst - The Physical Impossibility of Death" },
  { src: "/slides/slide-2.jpg", alt: "Framed portrait in moody interior" },
  { src: "/slides/slide-3.jpg", alt: "Art book collection" },
  { src: "/slides/slide-4.jpg", alt: "Jan Matejko - Battle of Grunwald" },
  { src: "/slides/slide-5.jpg", alt: "Art Nouveau theatre posters exhibition" },
  { src: "/slides/slide-6.jpg", alt: "Botticelli - Young Man Holding a Roundel" },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return
      setIsTransitioning(true)
      setPrevious(current)
      setCurrent(index)
      setTimeout(() => {
        setPrevious(null)
        setIsTransitioning(false)
      }, 3000)
    },
    [isTransitioning, current],
  )

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="px-6 lg:px-8 py-6">
      <div className="relative max-w-[1280px] mx-auto overflow-hidden" style={{ aspectRatio: "16 / 7" }}>
        {/* Slides */}
        {slides.map((slide, i) => {
          const isActive = i === current
          const isPrev = i === previous
          const isVisible = isActive || isPrev

          return (
            <div
              key={slide.src}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : isPrev ? 0 : 0,
                transform: isActive ? "scale(1)" : isPrev ? "scale(1.03)" : "scale(1)",
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
                transition: isVisible
                  ? "opacity 3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)"
                  : "none",
              }}
            >
              <Image
                src={slide.src || "/placeholder.svg"}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1280px"
                priority={i === 0}
              />
            </div>
          )
        })}

        {/* Semi-transparent overlay with text */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-foreground/50 px-20 py-12 md:px-32 md:py-20">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-background text-center tracking-wide text-balance">
              Auctions coming soon
            </h2>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-foreground/30 hover:bg-foreground/50 text-background rounded-full p-2 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-foreground/30 hover:bg-foreground/50 text-background rounded-full p-2 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((slide, i) => (
            <button
              type="button"
              key={slide.src}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? "bg-background" : "bg-background/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
