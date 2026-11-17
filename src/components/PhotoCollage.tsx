'use client';

import React from 'react';
import { GalleryPhoto } from '@/types/invitation';
import { Reveal } from './Reveal';

interface PhotoCollageProps {
  photos: GalleryPhoto[];
  startIndex: number;
  onSelectPhoto: (globalIndex: number) => void;
  title?: string;
  sectionId?: string;
}

// Hand-placed mosaic on a 6-column grid: every tile has a different size
// and shape (arch, leaf corners) so the collage feels loose, not like a table.
const TILES = [
  { area: 'col-start-1 col-end-5 row-start-1 row-end-6', shape: 'rounded-[12px] rounded-tl-[70px]', pos: 'center 42%' },
  { area: 'col-start-5 col-end-7 row-start-1 row-end-4', shape: 'rounded-t-full rounded-b-[12px]', pos: 'center 52%' },
  { area: 'col-start-5 col-end-7 row-start-4 row-end-9', shape: 'rounded-[12px]', pos: 'center 45%' },
  { area: 'col-start-1 col-end-3 row-start-6 row-end-13', shape: 'rounded-[12px] rounded-bl-[60px]', pos: 'center 55%' },
  { area: 'col-start-3 col-end-5 row-start-6 row-end-9', shape: 'rounded-full', pos: 'center 50%' },
  { area: 'col-start-3 col-end-7 row-start-9 row-end-13', shape: 'rounded-[12px] rounded-br-[70px]', pos: 'center 28%' },
  { area: 'col-start-1 col-end-7 row-start-13 row-end-17', shape: 'rounded-[12px] rounded-tr-[80px] rounded-bl-[80px]', pos: '32% 32%' },
];

export function PhotoCollage({ photos, startIndex, onSelectPhoto, title, sectionId }: PhotoCollageProps) {
  const items = photos.slice(0, TILES.length);
  if (items.length === 0) return null;

  return (
    <section data-id={sectionId} className="w-full pt-[22px] pb-[26px] md:pt-[32px] md:pb-[36px]">
      {title && (
        <div className="max-w-[1140px] mx-auto px-[20px] pt-[12px] pb-[18px] text-center">
          <Reveal variant="fadeInUp" className="flex justify-center mb-[10px]">
            <img src="/images/divider-gold.svg" alt="" aria-hidden="true" className="w-[100px] h-auto mx-auto" />
          </Reveal>
          <Reveal variant="fadeInUp">
            <h2 className="font-dynalight text-[35px] md:text-[45px] leading-[1.2] font-normal text-[#A59071]">
              {title}
            </h2>
          </Reveal>
        </div>
      )}

      <div className="max-w-[560px] mx-auto px-[12px] md:px-[24px]">
        <div className="grid grid-cols-6 auto-rows-[40px] md:auto-rows-[58px] gap-[8px]">
          {items.map((photo, idx) => {
            const tile = TILES[idx];
            return (
              <Reveal
                key={photo.id}
                variant={idx % 3 === 0 ? 'zoomIn' : 'fadeInUp'}
                delayMs={(idx % 3) * 120}
                className={`${tile.area} h-full`}
              >
                <button
                  type="button"
                  onClick={() => onSelectPhoto(startIndex + idx)}
                  aria-label={`Lihat foto ${photo.alt}`}
                  className={`group relative block w-full h-full overflow-hidden cursor-zoom-in shadow-[0_14px_30px_-18px_rgba(60,40,10,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A48C4D] ${tile.shape}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: tile.pos }}
                  />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-[5px] border border-white/40 ${tile.shape}`}
                  />
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Ornamen garis ukiran emas dengan bunga di tengah sebelum bagian penutup akhir */}
        <Reveal variant="fadeInUp" className="mt-[26px] md:mt-[34px] flex items-center justify-center px-1">
          <svg
            viewBox="0 0 520 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-full max-w-[480px] h-auto"
          >
            <defs>
              <linearGradient id="goldLineLeft" x1="0" y1="28" x2="210" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#C79A4E" stopOpacity="0.05" />
                <stop offset="0.35" stopColor="#C79A4E" stopOpacity="0.65" />
                <stop offset="1" stopColor="#B8924A" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="goldLineRight" x1="520" y1="28" x2="310" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#C79A4E" stopOpacity="0.05" />
                <stop offset="0.35" stopColor="#C79A4E" stopOpacity="0.65" />
                <stop offset="1" stopColor="#B8924A" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="goldFloral" x1="160" y1="6" x2="360" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#E5B968" />
                <stop offset="0.5" stopColor="#B8924A" />
                <stop offset="1" stopColor="#9A7632" />
              </linearGradient>
              <path id="petalEnd" d="M0,0 C-5.5,-4.5 -6.5,-13 0,-17.5 C6.5,-13 5.5,-4.5 0,0Z" />
              <path id="leafEnd" d="M0,0 Q5.5,-8.5 0,-18 Q-5.5,-8.5 0,0Z" />
              <g id="carvedWing">
                {/* Main extending horizontal line & double fine hairline */}
                <line x1="-250" y1="0" x2="-96" y2="0" stroke="url(#goldLineLeft)" strokeWidth="1.4" />
                <line x1="-215" y1="-3.5" x2="-106" y2="-3.5" stroke="url(#goldLineLeft)" strokeWidth="0.6" strokeDasharray="2 3" />
                <line x1="-215" y1="3.5" x2="-106" y2="3.5" stroke="url(#goldLineLeft)" strokeWidth="0.6" strokeDasharray="2 3" />
                {/* Diamond & scroll accents along the line */}
                <path d="M-190,0 L-185,-4 L-180,0 L-185,4 Z" fill="#C79A4E" fillOpacity="0.7" />
                <circle cx="-152" cy="0" r="2" fill="#B8924A" />
                <path d="M-126,0 L-120,-4.5 L-114,0 L-120,4.5 Z" stroke="url(#goldFloral)" strokeWidth="1.1" fill="#FFF8ED" />
                {/* Balinese floral vine curves */}
                <path d="M-18,2 C-40,8 -64,6 -92,-2" stroke="url(#goldFloral)" strokeWidth="1.45" strokeLinecap="round" />
                <path d="M-22,-2 C-38,-8 -58,-7 -78,-1" stroke="url(#goldFloral)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.75" />
                <use href="#leafEnd" transform="translate(-32,5) rotate(-52)" stroke="url(#goldFloral)" strokeWidth="1.35" />
                <use href="#leafEnd" transform="translate(-34,6) rotate(-128)" stroke="url(#goldFloral)" strokeWidth="1.35" />
                <use href="#leafEnd" transform="translate(-52,6) rotate(-60) scale(0.85)" stroke="url(#goldFloral)" strokeWidth="1.35" />
                <use href="#leafEnd" transform="translate(-54,6) rotate(-120) scale(0.85)" stroke="url(#goldFloral)" strokeWidth="1.35" />
                <use href="#leafEnd" transform="translate(-72,3) rotate(-68) scale(0.7)" stroke="url(#goldFloral)" strokeWidth="1.35" />
                <use href="#leafEnd" transform="translate(-74,3) rotate(-112) scale(0.7)" stroke="url(#goldFloral)" strokeWidth="1.35" />
                <circle cx="-97" cy="-2" r="2" fill="#B8924A" />
              </g>
            </defs>

            <g transform="translate(260, 28)">
              {/* Left & Right Carved Wings */}
              <use href="#carvedWing" />
              <use href="#carvedWing" transform="scale(-1, 1)" />

              {/* Center Frangipani (Bunga Jepun Bali) */}
              <g stroke="url(#goldFloral)" strokeWidth="1.45" fill="#FFFDF9">
                <use href="#petalEnd" />
                <use href="#petalEnd" transform="rotate(72)" />
                <use href="#petalEnd" transform="rotate(144)" />
                <use href="#petalEnd" transform="rotate(216)" />
                <use href="#petalEnd" transform="rotate(288)" />
                <circle r="2.8" fill="#C79A4E" />
              </g>
            </g>
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
