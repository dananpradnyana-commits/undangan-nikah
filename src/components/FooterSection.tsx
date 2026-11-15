import React from 'react';
import { Reveal } from './Reveal';

interface FooterSectionProps {
  coupleTitle: string;
  bannerBackground: string;
  monogramLogo: string;
  vendorLogo?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  copyrightText?: string;
  copyrightUrl?: string;
}

export function FooterSection({ coupleTitle, bannerBackground, monogramLogo }: FooterSectionProps) {
  return (
    <section
      data-id="couple-banner"
      className="relative w-full min-h-[440px] md:min-h-[480px] flex flex-col items-center justify-center text-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${bannerBackground}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75"
      />

      <div className="relative z-10 flex flex-col items-center px-4 py-[60px]">
        <Reveal variant="zoomIn" className="mb-[14px]">
          <img
            src={monogramLogo}
            alt={`Monogram ${coupleTitle}`}
            loading="lazy"
            className="w-[92px] h-auto mx-auto"
          />
        </Reveal>

        <Reveal variant="fadeInUp">
          <p
            className="font-dynalight text-[35px] md:text-[40px] leading-[1.2] font-normal text-white"
            style={{ textShadow: '0px 11px 9px rgba(0, 0, 0, 0.55)' }}
          >
            {coupleTitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
