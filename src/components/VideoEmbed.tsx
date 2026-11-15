'use client';

import React from 'react';
import { Reveal } from './Reveal';

interface VideoEmbedProps {
  videoId: string;
  title?: string;
}

export function VideoEmbed({ videoId, title = 'Video Prewedding Pawiwahan' }: VideoEmbedProps) {
  return (
    <div className="w-full my-[15px] md:my-[20px]">
      <Reveal variant="fadeInUp" className="max-w-[1140px] mx-auto px-[10px] md:px-[20px]">
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?feature=oembed&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </Reveal>
    </div>
  );
}
