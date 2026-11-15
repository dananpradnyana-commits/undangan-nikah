'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { GalleryPhoto } from '@/types/invitation';

interface LightboxModalProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (newIndex: number) => void;
}

export function LightboxModal({
  photos,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxModalProps) {
  const [zoomed, setZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < photos.length;

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    setZoomed(false);
    onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, onChangeIndex, photos.length]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    setZoomed(false);
    onChangeIndex((activeIndex + 1) % photos.length);
  }, [activeIndex, onChangeIndex, photos.length]);

  useEffect(() => {
    if (!isOpen) {
      setZoomed(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Ignore fullscreen permission errors
    }
  };

  if (!isOpen || activeIndex === null) return null;

  const currentPhoto = photos[activeIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galeri Foto Layar Penuh"
      className="fixed inset-0 z-[3000] bg-black/92 flex flex-col select-none"
      onClick={onClose}
    >
      {/* Top Toolbar */}
      <div
        className="flex items-center justify-between px-4 md:px-6 h-[56px] text-white/85 text-[14px] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-poppins tracking-wide">
          {activeIndex + 1} / {photos.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? 'Perkecil foto' : 'Perbesar foto'}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Layar penuh"
            className="hidden sm:inline-flex p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup galeri"
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 pb-6">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Foto sebelumnya"
          className="absolute left-2 md:left-6 z-10 p-2.5 rounded-full bg-black/45 hover:bg-black/75 text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <img
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
          className={`max-h-[82vh] max-w-[90vw] object-contain transition-transform duration-300 ${
            zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Foto selanjutnya"
          className="absolute right-2 md:right-6 z-10 p-2.5 rounded-full bg-black/45 hover:bg-black/75 text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </div>
    </div>
  );
}
