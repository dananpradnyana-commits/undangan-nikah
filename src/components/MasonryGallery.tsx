'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { GalleryPhoto } from '@/types/invitation';
import { Reveal } from './Reveal';

interface MasonryGalleryProps {
  photos: GalleryPhoto[];
  startIndex: number;
  onSelectPhoto: (globalIndex: number) => void;
  title?: string;
  sectionId?: string;
  showThumbs?: boolean;
}

const SLIDE_MS = 5000;
const pad = (n: number) => String(n).padStart(2, '0');

export function MasonryGallery({
  photos,
  startIndex,
  onSelectPhoto,
  title,
  sectionId,
  showThumbs = true,
}: MasonryGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [held, setHeld] = useState(false); // finger / mouse is on the stage
  const [inView, setInView] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);

  const count = photos.length;
  const paused = held || !inView;

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Only run the slideshow while it is actually on screen
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keep the active thumbnail centred in its strip without scrolling the page
  useEffect(() => {
    const container = thumbsContainerRef.current;
    if (!container) return;
    const activeThumb = container.children[current] as HTMLElement | undefined;
    if (!activeThumb) return;
    const targetLeft =
      activeThumb.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [current]);

  if (count === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setHeld(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setHeld(false);
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const prevIdx = (current - 1 + count) % count;
  const nextIdx = (current + 1) % count;

  return (
    <section data-id={sectionId} className="w-full py-[22px] md:py-[32px]">
      {title && (
        <div className="max-w-[1140px] mx-auto px-[20px] pt-[12px] pb-[18px] text-center">
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

      <Reveal variant="fadeInUp" className="max-w-[560px] mx-auto px-[18px] md:px-[24px]">
        <div className="relative select-none">
          {/* Stage */}
          <div
            ref={stageRef}
            className="relative w-full aspect-[4/5] rounded-[22px] overflow-hidden bg-[#17110f] shadow-[0_26px_50px_-24px_rgba(60,40,10,0.7)]"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setHeld(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => setHeld(false)}
          >
            {photos.map((photo, idx) => {
              const isActive = idx === current;
              // keep only the visible slide and its neighbours mounted
              if (!isActive && idx !== prevIdx && idx !== nextIdx) return null;
              return (
                <div
                  key={photo.id}
                  aria-hidden={!isActive}
                  className={`absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    draggable={false}
                    className={`relative w-full h-full object-cover ${
                      isActive ? (idx % 2 === 0 ? 'gallery-zoom-in' : 'gallery-zoom-out') : ''
                    }`}
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                  />
                </div>
              );
            })}

            {/* tap anywhere on the photo to open it full screen */}
            <button
              type="button"
              onClick={() => onSelectPhoto(startIndex + current)}
              aria-label={`Perbesar foto ${photos[current].alt}`}
              className="absolute inset-0 z-20 cursor-zoom-in focus:outline-none"
            />

            {/* soft shading + thin gold inner frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/15"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[10px] z-20 rounded-[14px] border border-[#EFBC72]/35"
            />

            {/* expand icon */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 bottom-6 z-30 w-8 h-8 rounded-full bg-black/35 border border-white/25 text-white/90 flex items-center justify-center"
            >
              <Maximize2 className="w-[14px] h-[14px]" />
            </span>

            {/* gold progress line — also the timer that advances the slide */}
            {count > 1 && (
              <div className="absolute left-0 right-0 bottom-0 z-30 h-[3px] bg-white/15">
                <span
                  key={current}
                  onAnimationEnd={nextSlide}
                  className="gallery-progress block h-full bg-gradient-to-r from-[#EFBC72] to-[#C99A4C]"
                  style={{
                    animationDuration: `${SLIDE_MS}ms`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {showThumbs && count > 1 && (
            <div
              ref={thumbsContainerRef}
              className="mt-4 flex items-center gap-2.5 overflow-x-auto py-1.5 px-1 no-scrollbar"
              style={{ scrollbarWidth: 'none' }}
            >
              {photos.map((photo, idx) => {
                const isActive = idx === current;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Pilih foto ${idx + 1}`}
                    aria-current={isActive}
                    className={`relative shrink-0 w-[52px] h-[66px] rounded-[10px] overflow-hidden transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-[#C99A4C] ring-offset-2 ring-offset-white opacity-100'
                        : 'opacity-50 hover:opacity-85 scale-[0.94]'
                    }`}
                  >
                    <img src={photo.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
