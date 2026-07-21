"use client";
import { useState, useEffect } from "react";

interface Props {
  images: string[];
  /** ms entre transiciones */
  interval?: number;
  /** mostrar los puntitos indicadores */
  dots?: boolean;
}

/**
 * Slider del hero con crossfade automático.
 * Imágenes a pantalla completa del contenedor (object-cover).
 * El contenedor padre define la forma (panel diagonal / franja).
 */
export function HeroSlider({ images, interval = 5000, dots = true }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === idx ? "hero-zoom" : ""
          }`}
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}

      {dots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
