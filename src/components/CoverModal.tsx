'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CoverModalProps {
  guestName: string;
  coverPhoto?: string;
  coupleTitle: string;
  eventDateText: string;
  isOpen: boolean;
  onOpenInvitation: () => void;
}

/** Total length of the envelope-opening sequence before the cover unmounts. */
export const COVER_OPEN_DURATION_MS = 2500;

// 0 idle · 1 seal breaks + flap opens · 2 letter slides out · 3 cover dissolves · 4 gone
type Phase = 0 | 1 | 2 | 3 | 4;

export function CoverModal({
  guestName,
  coupleTitle,
  eventDateText,
  onOpenInvitation,
}: CoverModalProps) {
  const [phase, setPhase] = useState<Phase>(0);
  const [flapBehind, setFlapBehind] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    document.body.style.overflow = phase < 3 ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [phase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (phase !== 0) return;
    onOpenInvitation(); // starts the music inside the user gesture
    setPhase(1);
    timers.current = [
      setTimeout(() => setFlapBehind(true), 420),
      setTimeout(() => setPhase(2), 750),
      setTimeout(() => setPhase(3), 1700),
      setTimeout(() => setPhase(4), COVER_OPEN_DURATION_MS),
    ];
  };

  if (phase === 4) return null;

  const fadeText: React.CSSProperties = {
    opacity: phase === 0 ? 1 : 0,
    transform: phase === 0 ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'opacity 450ms ease, transform 450ms ease',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sampul Undangan Pernikahan"
      className="fixed inset-0 z-[2000] w-full h-full bg-[#0f0a0d] overflow-hidden"
      style={{
        opacity: phase === 3 ? 0 : 1,
        transform: phase === 3 ? 'scale(1.12)' : 'scale(1)',
        filter: phase === 3 ? 'blur(6px)' : 'none',
        transition: 'opacity 800ms ease, transform 800ms ease, filter 800ms ease',
        pointerEvents: phase === 0 ? 'auto' : 'none',
      }}
    >
      {/* Veiled backdrop: the photo is only hinted at until the letter is opened */}
      <div
        aria-hidden="true"
        className="absolute inset-[-40px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/cover-bg.jpeg')",
          filter: 'blur(18px) brightness(0.5) saturate(0.85)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 45%, rgba(15,10,13,0.15) 0%, rgba(15,10,13,0.72) 62%, rgba(15,10,13,0.94) 100%)',
        }}
      />

      {/* Gold carved corners + hairline frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[14px]">
        <div className="absolute inset-[7px] border border-[#EFBC72]/20" />
        <img src="/images/corner-gold.svg" alt="" className="absolute top-0 left-0 w-[92px] h-[92px] opacity-90" />
        <img src="/images/corner-gold.svg" alt="" className="absolute top-0 right-0 w-[92px] h-[92px] opacity-90 -scale-x-100" />
        <img src="/images/corner-gold.svg" alt="" className="absolute bottom-0 left-0 w-[92px] h-[92px] opacity-90 -scale-y-100" />
        <img src="/images/corner-gold.svg" alt="" className="absolute bottom-0 right-0 w-[92px] h-[92px] opacity-90 -scale-100" />
      </div>

      <div className="relative z-[2002] w-full h-full overflow-y-auto">
        <div className="min-h-full grid grid-rows-[1fr_auto_1fr] justify-items-center text-center px-6 py-14">
          {/* Guest */}
          <div style={fadeText} className="self-end pb-9 flex flex-col items-center">
            <img src="/images/divider-gold.svg" alt="" className="w-[130px] h-auto mb-4 opacity-90" />
            <p className="font-montserrat text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-white/70 leading-relaxed">
              KEPADA BAPAK / IBU / SAUDARA / SAUDARI
            </p>
            <p className="namatamu my-2.5 font-lora text-[24px] md:text-[26px] leading-[32px] font-medium text-white/95 break-words max-w-[90vw]">
              {guestName}
            </p>
            <p className="font-montserrat text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-white/70">
              YANG KAMI HORMATI
            </p>
          </div>

          {/* Envelope */}
          <button
            type="button"
            onClick={open}
            aria-label="Buka undangan"
            className="cover-envelope relative w-[290px] h-[190px] cursor-pointer select-none"
            style={{ perspective: '1100px' }}
          >
            {/* back of the envelope */}
            <span className="absolute inset-0 rounded-[10px] bg-gradient-to-b from-[#e9d8b6] to-[#dcc79f] shadow-[0_30px_60px_-22px_rgba(0,0,0,0.85)]" />

            {/* the letter */}
            <span
              className="absolute left-[14px] right-[14px] top-[10px] h-[168px] rounded-[8px] bg-[#fffaf0] flex flex-col items-center justify-start pt-4 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.5)]"
              style={{
                zIndex: 2,
                transform:
                  phase >= 3
                    ? 'translateY(-112px) scale(1.18)'
                    : phase === 2
                    ? 'translateY(-96px) scale(1)'
                    : 'translateY(0) scale(1)',
                transition: 'transform 950ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <img src="/images/divider-gold.svg" alt="" className="w-[92px] h-auto" />
              <span className="mt-1 font-dynalight text-[27px] leading-[1.2] text-[#8a6d3b]">
                {coupleTitle}
              </span>
              <span className="mt-1 font-lora text-[9px] tracking-[0.28em] uppercase text-[#a48c4d]">
                {eventDateText}
              </span>
            </span>

            {/* front pocket */}
            <span
              className="absolute inset-0 rounded-[10px] bg-gradient-to-b from-[#f4e7cc] to-[#e7d5b1]"
              style={{
                zIndex: 3,
                clipPath: 'polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)',
              }}
            />
            <span
              className="absolute inset-0 rounded-[10px] bg-[#d9c39a]/55"
              style={{ zIndex: 3, clipPath: 'polygon(0 100%, 50% 52%, 100% 100%)' }}
            />

            {/* top flap */}
            <span
              className="absolute left-0 right-0 top-0 h-[60%] bg-gradient-to-b from-[#f7ecd5] to-[#e2cea7]"
              style={{
                zIndex: flapBehind ? 1 : 4,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transformOrigin: 'top center',
                transform: phase >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                transition: 'transform 800ms cubic-bezier(0.45, 0, 0.2, 1)',
              }}
            />

            {/* wax seal */}
            <span
              className="absolute left-1/2 top-[60%] w-[62px] h-[62px] -ml-[31px] -mt-[31px] rounded-full flex items-center justify-center bg-[radial-gradient(circle_at_35%_30%,#f6d79c,#c9963f_60%,#9a6f27)] shadow-[0_8px_18px_-6px_rgba(0,0,0,0.7)] ring-1 ring-[#8a6424]/50"
              style={{
                zIndex: 5,
                opacity: phase === 0 ? 1 : 0,
                transform: phase === 0 ? 'scale(1) rotate(0deg)' : 'scale(1.6) rotate(-18deg)',
                transition: 'opacity 380ms ease, transform 380ms ease',
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full ring-2 ring-[#EFBC72]/70 animate-ping [animation-duration:2.2s] motion-reduce:hidden"
              />
              <span className="relative font-lora italic text-[17px] font-semibold text-[#5a3d12]">
                E<span className="text-[12px] mx-[1px]">&amp;</span>T
              </span>
            </span>
          </button>

          {/* Hint */}
          <button
            type="button"
            onClick={open}
            style={fadeText}
            className="self-start mt-9 font-montserrat text-[10px] font-medium tracking-[0.38em] uppercase text-[#EFBC72]/85 cursor-pointer animate-pulse [animation-duration:2.6s] motion-reduce:animate-none"
          >
            Ketuk segel untuk membuka
          </button>
        </div>
      </div>
    </div>
  );
}
