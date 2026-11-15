import React from 'react';
import { ImagesFilterIcon } from './icons';
import { Reveal } from './Reveal';

interface FilterButton {
  label: string;
  href: string;
}

interface TwoColumnFeatureCardProps {
  sectionId: string;
  title: string;
  description: string;
  photoSrc: string;
  photoAlt: string;
  buttons?: FilterButton[];
}

export function TwoColumnFeatureCard({
  sectionId,
  title,
  description,
  photoSrc,
  photoAlt,
  buttons,
}: TwoColumnFeatureCardProps) {
  return (
    <section data-id={sectionId} className="w-full my-[40px] md:my-[50px] px-[20px]">
      <div
        className="max-w-[1100px] mx-auto bg-white rounded-[25px] p-[20px] md:p-[30px] md:pb-[50px]"
        style={{ boxShadow: '2px 5px 10px 0px rgba(0, 0, 0, 0.5)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[30px] items-center">
          {/* Left Column: Divider + Script Heading + Italic Copy + Optional Filter Buttons */}
          <div className="flex flex-col items-center text-center px-[10px] py-[10px]">
            <Reveal variant="fadeInUp" className="mb-[12px]">
              <img
                src="/images/divider-gold.svg"
                alt=""
                aria-hidden="true"
                className="w-[100px] h-auto mx-auto"
              />
            </Reveal>

            <Reveal variant="fadeInUp" className="mb-[14px]">
              <h2 className="font-dynalight text-[35px] md:text-[45px] leading-[1.2] font-normal text-[#A59071]">
                {title}
              </h2>
            </Reveal>

            <Reveal variant="fadeInUp" className={buttons?.length ? 'mb-[22px]' : ''}>
              <p className="font-poppins italic text-[14px] md:text-[13px] leading-[1.7] text-[#474747] max-w-[380px]">
                {description}
              </p>
            </Reveal>

            {buttons && buttons.length > 0 && (
              <div className="flex flex-col items-center gap-[14px] w-full">
                {buttons.map((btn) => (
                  <Reveal key={btn.label} variant="fadeInUp">
                    <a
                      href={btn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-[8px] min-w-[180px] px-[24px] py-[11px] border border-black rounded-[10px] font-roboto text-[14px] leading-none font-medium text-black bg-transparent hover:bg-black hover:text-white transition-colors duration-200"
                    >
                      <ImagesFilterIcon className="w-[15px] h-[15px] shrink-0" />
                      <span>{btn.label}</span>
                    </a>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Featured Photo */}
          <Reveal variant="fadeInUp" className="w-full">
            <img
              src={photoSrc}
              alt={photoAlt}
              loading="lazy"
              className="w-full h-auto rounded-[20px] md:rounded-[6px] object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
