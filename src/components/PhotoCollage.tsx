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
  { area: 'col-start-1 col-end-5 row-start-1 row-end-6', shape: 'rounded-[12px] rounded-tl-[70px]', pos: 'center 30%' },
  { area: 'col-start-5 col-end-7 row-start-1 row-end-4', shape: 'rounded-t-full rounded-b-[12px]', pos: 'center 25%' },
  { area: 'col-start-5 col-end-7 row-start-4 row-end-9', shape: 'rounded-[12px]', pos: 'center' },
  { area: 'col-start-1 col-end-3 row-start-6 row-end-13', shape: 'rounded-[12px] rounded-bl-[60px]', pos: 'center 40%' },
  { area: 'col-start-3 col-end-5 row-start-6 row-end-9', shape: 'rounded-full', pos: 'center 30%' },
  { area: 'col-start-3 col-end-7 row-start-9 row-end-13', shape: 'rounded-[12px] rounded-br-[70px]', pos: 'center 35%' },
  { area: 'col-start-1 col-end-7 row-start-13 row-end-17', shape: 'rounded-[12px] rounded-tr-[80px] rounded-bl-[80px]', pos: 'center 45%' },
];

export function PhotoCollage({ photos, startIndex, onSelectPhoto, title, sectionId }: PhotoCollageProps) {
  const items = photos.slice(0, TILES.length);
  if (items.length === 0) return null;

  return (
    <section data-id={sectionId} className="w-full py-[22px] md:py-[32px]">
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
      </div>
    </section>
  );
}
