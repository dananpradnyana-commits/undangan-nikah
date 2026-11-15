'use client';

import React, { useMemo } from 'react';
import { GalleryPhoto } from '@/types/invitation';
import { Reveal } from './Reveal';

interface MasonryGalleryProps {
  photos: GalleryPhoto[];
  startIndex: number;
  onSelectPhoto: (globalIndex: number) => void;
  title?: string;
  sectionId?: string;
}

interface IndexedPhoto {
  photo: GalleryPhoto;
  globalIndex: number;
}

export function MasonryGallery({
  photos,
  startIndex,
  onSelectPhoto,
  title,
  sectionId,
}: MasonryGalleryProps) {
  // Packery / Masonry 2-column shortest-column distribution using intrinsic aspect ratios
  const [colLeft, colRight] = useMemo(() => {
    const left: IndexedPhoto[] = [];
    const right: IndexedPhoto[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    photos.forEach((photo, idx) => {
      const ratio = photo.height / photo.width;
      const item: IndexedPhoto = { photo, globalIndex: startIndex + idx };
      if (leftHeight <= rightHeight) {
        left.push(item);
        leftHeight += ratio;
      } else {
        right.push(item);
        rightHeight += ratio;
      }
    });

    return [left, right];
  }, [photos, startIndex]);

  const renderTile = ({ photo, globalIndex }: IndexedPhoto) => (
    <button
      key={photo.id}
      type="button"
      onClick={() => onSelectPhoto(globalIndex)}
      aria-label={`Lihat foto ${photo.alt}`}
      className="group relative block w-full overflow-hidden rounded-[10px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A48C4D]"
    >
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        className="block w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-[800ms] ease-in-out"
      />
    </button>
  );

  return (
    <section data-id={sectionId} className="w-full py-[10px]">
      {title && (
        <div className="max-w-[1140px] mx-auto px-[20px] pt-[30px] pb-[15px] text-center">
          <Reveal variant="fadeInUp" className="flex justify-center mb-[10px]">
            <img
              src="/images/divider-gold.svg"
              alt=""
              aria-hidden="true"
              className="w-[100px] h-auto mx-auto"
            />
          </Reveal>
          <Reveal variant="fadeInUp">
            <h2 className="font-dynalight text-[35px] md:text-[45px] leading-[1.2] font-normal text-[#A59071]">
              {title}
            </h2>
          </Reveal>
        </div>
      )}

      <div className="max-w-[1140px] mx-auto px-[10px] md:px-[20px]">
        <div className="grid grid-cols-2 gap-[10px] items-start">
          <div className="flex flex-col gap-[10px]">{colLeft.map(renderTile)}</div>
          <div className="flex flex-col gap-[10px]">{colRight.map(renderTile)}</div>
        </div>
      </div>
    </section>
  );
}
