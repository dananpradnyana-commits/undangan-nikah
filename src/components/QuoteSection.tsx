import React from 'react';
import { Reveal } from './Reveal';

interface QuoteSectionProps {
  sanskrit: string;
  source: string;
  translation: string;
}

export function QuoteSection({ sanskrit, source, translation }: QuoteSectionProps) {
  return (
    <section
      data-id="66ae2908"
      className="w-full bg-white md:bg-white pt-[20px] pb-[15px]"
    >
      <div className="max-w-[1140px] mx-auto px-0 md:px-4">
        <Reveal variant="fadeInUp" className="text-center mb-[20px]">
          <img
            src="/images/ornament-frangipani.svg"
            alt=""
            width={70}
            height={142}
            className="w-[70px] h-auto mx-auto"
          />
        </Reveal>

        <Reveal variant="fadeInUp">
          <div className="bg-[#F3CBA8] mb-[20px]">
            <div className="bg-white py-[35px] px-[20px] md:py-[55px] md:px-[50px] text-center">
              <p
                className="font-lora italic font-medium text-[16px] md:text-[17px] leading-[1.7] text-[#81734D] mb-[20px]"
                style={{ transform: 'skewX(-9deg)' }}
              >
                {sanskrit}
              </p>

              <p className="font-lora font-bold text-[18px] md:text-[20px] leading-none uppercase tracking-[0.06em] lining-nums tabular-nums text-[#817556] pb-0 md:pb-[24px] px-0 md:px-[20px] mb-[20px]">
                {source}
              </p>

              <p className="font-poppins text-[14px] leading-[1.7] font-normal text-[#474747] max-w-[920px] mx-auto">
                {translation}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
