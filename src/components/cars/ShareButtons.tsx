"use client";
import { useEffect, useState } from "react";
import { Share2, Link2, Check, Facebook } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface Props {
  url: string;
  title: string;
  text: string;
}

export function ShareButtons({ url, title, text }: Props) {
  const [copied, setCopied] = useState(false);

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch {}
  };

  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => setCanNativeShare(!!navigator.share), []);

  return (
    <div className="mt-5 pt-4 border-t border-white/[0.08]">
      <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
        <Share2 size={12} /> Compartir
      </p>
      <div className="flex gap-2">
        <a
          href={waShare}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-[#25D366] border border-white/[0.1] hover:border-transparent text-white/70 hover:text-white text-xs font-bold py-2.5 transition-colors"
          aria-label="Compartir por WhatsApp"
        >
          <WhatsAppIcon size={14} /> WhatsApp
        </a>
        <a
          href={fbShare}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-[#1877F2] border border-white/[0.1] hover:border-transparent text-white/70 hover:text-white text-xs font-bold py-2.5 transition-colors"
          aria-label="Compartir en Facebook"
        >
          <Facebook size={14} /> Facebook
        </a>
        <button
          type="button"
          onClick={canNativeShare ? nativeShare : copyLink}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-brand-red border border-white/[0.1] hover:border-transparent text-white/70 hover:text-white text-xs font-bold py-2.5 transition-colors"
          aria-label={canNativeShare ? "Compartir" : "Copiar link"}
        >
          {copied ? (
            <>
              <Check size={14} /> Copiado
            </>
          ) : canNativeShare ? (
            <>
              <Share2 size={14} /> Más
            </>
          ) : (
            <>
              <Link2 size={14} /> Copiar link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
