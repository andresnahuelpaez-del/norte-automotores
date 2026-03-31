"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Props {
  images?: string[];
  video_url?: string;
  alt: string;
}

export function ImageSlider({ images = [], video_url, alt }: Props) {
  const slides = [...images, ...(video_url ? ["__video__"] : [])];
  const [idx, setIdx] = useState(0);
  const touchStart = useRef(0);

  if (slides.length === 0) {
    return (
      <div className="aspect-video rounded-none bg-brand-dark flex items-center justify-center shadow-lg">
        <span className="text-white/30 font-display text-xl">Sin fotos</span>
      </div>
    );
  }

  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx(i => (i + 1) % slides.length);
  const current = slides[idx];

  return (
    <div className="space-y-3">
      {/* Main slide */}
      <div
        className="relative aspect-video rounded-none overflow-hidden bg-brand-dark shadow-lg select-none"
        onTouchStart={e => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (diff > 40) next();
          else if (diff < -40) prev();
        }}
      >
        {current === "__video__" ? (
          <div className="w-full h-full bg-black flex flex-col items-center justify-center gap-4">
            <a
              href={video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                <Play size={28} fill="white" className="text-white ml-1" />
              </div>
              <span className="text-sm font-semibold">Ver video</span>
            </a>
          </div>
        ) : (
          <Image
            src={current}
            alt={`${alt} - foto ${idx + 1}`}
            fill
            className="object-cover transition-opacity duration-200"
            priority={idx === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        )}

        {/* Counter */}
        {slides.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {idx + 1} / {slides.length}
          </div>
        )}

        {/* Arrow buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Foto siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && slides.length <= 12 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === idx ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative w-20 h-14 rounded-none overflow-hidden shrink-0 transition-all border-2 ${
                i === idx
                  ? "border-brand-red shadow-md shadow-brand-red/20"
                  : "border-transparent opacity-55 hover:opacity-90"
              }`}
            >
              {slide === "__video__" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Play size={16} fill="white" className="text-white" />
                </div>
              ) : (
                <Image src={slide} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="80px" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
