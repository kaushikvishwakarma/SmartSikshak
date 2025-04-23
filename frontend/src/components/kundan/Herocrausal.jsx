// components/HeroCarousel.jsx
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const images = [
  "/banners/1.jpg",
  "/banners/22.jpg",
  "/banners/33.jpg",
  "/banners/44.jpg"
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden relative">
      {/* Slides */}
      <div className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Banner ${idx + 1}`}
            className="w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>
      {/* Navigation Buttons */}
<div className="absolute top-1/2 left-4 -translate-y-1/2">
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setCurrent((current - 1 + images.length) % images.length)}
  >
    ←
  </Button>
</div>
<div className="absolute top-1/2 right-4 -translate-y-1/2">
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setCurrent((current + 1) % images.length)}
  >
    →
  </Button>
</div>

      {/* Optional: Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "h-2 w-2 rounded-full",
              current === idx ? "bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}
