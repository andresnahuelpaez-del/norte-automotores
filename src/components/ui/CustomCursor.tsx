"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!el.closest("a, button, [data-cursor-hover]"));
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    // Hide native cursor
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Red dot — fast */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-red rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: clicking ? 0.5 : 1,
        }}
        transition={{ type: "spring", mass: 0.06, stiffness: 1000, damping: 20 }}
      />
      {/* Outer ring — lags behind */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: pos.x - (hovered ? 22 : 14),
          y: pos.y - (hovered ? 22 : 14),
          width: hovered ? 44 : 28,
          height: hovered ? 44 : 28,
          borderColor: hovered ? "rgba(204,32,32,0.7)" : "rgba(255,255,255,0.18)",
          backgroundColor: hovered ? "rgba(204,32,32,0.06)" : "transparent",
          scale: clicking ? 0.85 : 1,
        }}
        transition={{ type: "spring", mass: 0.5, stiffness: 180, damping: 22 }}
      />
    </>
  );
}
