import React from 'react';
import { Reveal } from './Reveal';

interface EventSectionProps {
  title: string;
  dayAndDateLines: [string, string];
  timeText: string;
  venueMain: string;
  venueSub: string;
  mapUrl: string;
  background: string;
}

function ClockIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

export function EventSection({
  title,
  dayAndDateLines,
  timeText,
  venueMain,
  venueSub,
  mapUrl,
  background,
}: EventSectionProps) {
  // "20 November 2026" -> big day number + month-year
  const [dayNum, ...rest] = dayAndDateLines[1].trim().split(' ');
  const monthYear = rest.join(' ');
  const dayName = dayAndDateLines[0].replace(/,$/, '');

  const calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Pawiwahan Gus Eka & Dek Tini') +
    '&dates=20261120T080000Z/20261120T110000Z' +
    '&location=' + encodeURIComponent('Sidemen, Karangasem, Bali') +
    '&details=' + encodeURIComponent('Dengan penuh suka cita, kami mengundang Anda untuk hadir di hari bahagia kami.');

  return (
    <section
      data-id="7b9b6c41"
      className="relative w-full min-h-screen my-[50px] bg-center bg-no-repeat bg-cover flex items-center justify-center px-5 py-[36px]"
      style={{ backgroundImage: `url('${background}')` }}
    >
      {/* Vignette overlay: darker top & bottom so the glass card floats clearly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(14,8,10,0.82) 0%, rgba(14,8,10,0.40) 45%, rgba(14,8,10,0.85) 100%)',
        }}
      />

      <Reveal variant="fadeInUp" className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-[26px] border border-white/20 bg-black/[0.18] backdrop-blur-[2px] px-7 py-7 text-center shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]">
          <img
            src="/images/divider-gold.svg"
            alt=""
            width={90}
            height={50}
            className="w-[86px] h-auto mx-auto mb-2"
          />

          <h2 className="font-dynalight text-[42px] md:text-[46px] leading-none font-normal text-[#EFBC72]">
            {title}
          </h2>

          {/* Date block */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-white/30" />
            <span className="font-montserrat text-[12px] tracking-[0.3em] uppercase text-white/75">
              {dayName}
            </span>
            <span className="h-px w-8 bg-white/30" />
          </div>

          <p className="mt-3 font-playfair text-white leading-none">
            <span className="block text-[64px] font-semibold text-[#EFBC72]">{dayNum}</span>
            <span className="block text-[20px] tracking-[0.15em] uppercase mt-1">{monthYear}</span>
          </p>

          {/* Time */}
          <p className="mt-5 flex items-center justify-center gap-2 font-poppins text-[15px] text-white/90">
            <ClockIcon className="w-[18px] h-[18px] text-[#EFBC72]" />
            {timeText}
          </p>

          <div className="mx-auto my-7 h-px w-24 bg-white/20" />

          {/* Venue */}
          <PinIcon className="w-[26px] h-[26px] mx-auto text-[#EFBC72]" />
          <p className="mt-2 font-montserrat text-[22px] font-bold text-white leading-snug">
            {venueMain}
          </p>
          <p className="font-poppins italic text-[14px] text-white/80">{venueSub}</p>

          {/* Interactive draggable Google Map */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/25 shadow-[0_14px_34px_-18px_rgba(0,0,0,0.75)]">
            <iframe
              title="Peta Lokasi Acara"
              src="https://www.google.com/maps?q=-8.4937222,115.4243889&z=16&output=embed"
              width="100%"
              height={230}
              loading="lazy"
              style={{ border: 0, display: 'block' }}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full font-roboto text-[15px] font-medium text-[#3a2a16] bg-gradient-to-r from-[#EFBC72] to-[#d9a24f] hover:brightness-105 active:scale-[0.98] rounded-full px-7 py-[13px] shadow-[0_12px_26px_-12px_rgba(239,188,114,0.9)] transition-all duration-200"
            >
              <PinIcon className="w-[16px] h-[16px]" />
              Lihat di Maps
            </a>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full font-roboto text-[14px] font-medium text-white/90 bg-transparent hover:bg-white/10 border border-white/35 rounded-full px-7 py-[11px] transition-colors duration-200"
            >
              <CalendarIcon className="w-[16px] h-[16px]" />
              Tambah ke Kalender
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
