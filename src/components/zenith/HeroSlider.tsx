"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
 
  {
    src: "/images/dollarbill.jpeg",
    label: "Dubai · UAE",
  },
  {
    src: "/images/100-euros-banknote-first-series-obverse-1.jpg",
    label: "Frankfurt · Europe",
  },
  {
    src: "/images/50-gbp-new1-247x185.jpg",
    label: "London · United Kingdom",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-elite-bg" />

      {/* Slide indicators — center bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-px transition-all duration-500 ${
              i === index ? "w-12 bg-elite-gold" : "w-8 bg-white/35 hover:bg-white/55"
            }`}
          />
        ))}
      </div>

      {/* Location label — bottom right */}
      <div className="absolute bottom-10 right-6 md:right-10 z-10">
        <span className="font-sans text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-elite-gold/90">
          {SLIDES[index].label}
        </span>
      </div>
    </div>
  );
}
