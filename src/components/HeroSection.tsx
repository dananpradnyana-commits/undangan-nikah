'use client';

import React, { useEffect, useState } from 'react';

interface HeroSectionProps {
  heading: string;
  coupleTitle: string;
  heroBackground: string;
  eventIsoDate: string;
  dateText?: string;
  /** flips to true once the cover is opened; drives the entrance sequence */
  entered?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(targetIso: string): TimeLeft {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function HeroSection({
  heading,
  coupleTitle,
  heroBackground,
  eventIsoDate,
  dateText,
  entered = true,
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(computeTimeLeft(eventIsoDate));
    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(eventIsoDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [eventIsoDate]);

  const items = [
    { value: timeLeft.days, label: 'Hari' },
    { value: timeLeft.hours, label: 'Jam' },
    { value: timeLeft.minutes, label: 'Menit' },
    { value: timeLeft.seconds, label: 'Detik' },
  ];

  const pad = (n: number) => String(n).padStart(2, '0');

  // staggered entrance: each element rises + un-blurs after `delay` ms
  const rise = (delay: number, blur = 0): React.CSSProperties => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0) scale(1)' : 'translateY(26px) scale(0.98)',
    filter: entered || !blur ? 'blur(0px)' : `blur(${blur}px)`,
    transition: `opacity 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 900ms ease ${delay}ms`,
  });

  return (
    <section
      data-id="24c321b3"
      className="relative w-full min-h-screen bg-black overflow-hidden"
    >
      {/* Vegas Ken Burns Animated Background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          transform: entered ? 'scale(1)' : 'scale(1.22)',
          filter: entered ? 'blur(0px)' : 'blur(8px)',
          transition: 'transform 2600ms cubic-bezier(0.22,1,0.36,1), filter 1400ms ease',
        }}
      >
        <div
          className="w-full h-full bg-cover bg-center animate-kenburns"
          style={{ backgroundImage: `url('${heroBackground}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      </div>

      {/* Foreground Content — balanced top title / bottom countdown */}
      <div className="relative z-10 min-h-screen w-full max-w-[1140px] mx-auto px-5 flex flex-col items-center text-center pt-[clamp(84px,14vh,130px)] pb-[clamp(110px,16vh,150px)]">
        {/* Top: ornament + title + names + date */}
        <div className="flex flex-col items-center">
          <img src="/images/divider-gold.svg" alt="" className="w-[120px] h-auto mb-3" style={rise(150)} />

          <h1 className="font-lora text-[18px] md:text-[24px] leading-none font-medium tracking-[0.32em] text-white/95" style={rise(350)}>
            {heading}
          </h1>

          <p
            className="font-dynalight text-[42px] md:text-[52px] font-light leading-[1.3] text-white mt-3"
            style={{ textShadow: '0px 6px 18px rgba(0, 0, 0, 0.6)', ...rise(600, 10) }}
          >
            {coupleTitle}
          </p>

          {dateText && (
            <p className="mt-1 flex items-center gap-3 font-lora text-[12px] tracking-[0.3em] uppercase text-[#EFBC72]" style={rise(950)}>
              <span className="h-px w-7 bg-[#EFBC72]/60" />
              {dateText}
              <span className="h-px w-7 bg-[#EFBC72]/60" />
            </p>
          )}
        </div>

        {/* Flexible gap keeps the photo visible without a huge empty hole */}
        <div className="flex-1 min-h-[32px]" aria-hidden="true" />

        {/* Bottom: save the date + countdown bar */}
        <div className="w-full max-w-[340px] flex flex-col items-center">
          <h2 className="font-lora text-[13px] md:text-[16px] leading-none font-normal tracking-[0.45em] uppercase text-white/85 mb-4" style={rise(1250)}>
            save the date
          </h2>

          <div className="grid grid-cols-4 w-full rounded-2xl bg-black/35 backdrop-blur-sm border border-[#EFBC72]/35 divide-x divide-white/15 py-3.5" style={rise(1450)}>
            {items.map((item, i) => (
              <div key={item.label} className="px-1" style={rise(1600 + i * 130)}>
                <span className="block font-lora text-[28px] md:text-[34px] leading-none font-normal text-[#F3CD8F] tabular-nums">
                  {pad(item.value)}
                </span>
                <span className="block font-montserrat text-[9px] md:text-[11px] leading-none font-medium tracking-[0.16em] uppercase text-white/70 mt-2">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
