import React from 'react';
import { PersonProfile } from '@/types/invitation';
import { Reveal } from './Reveal';

interface CoupleSectionProps {
  groom: PersonProfile;
  bride: PersonProfile;
}

function ProfileColumn({ person }: { person: PersonProfile }) {
  return (
    <div className="flex flex-col items-center text-center pt-[20px] md:pt-0 md:m-[10px]">
      <Reveal variant="fadeInLeft" className="w-full flex justify-center mb-[20px]">
        <img
          src={person.photo}
          alt={person.fullName}
          loading="lazy"
          className="max-w-[80%] md:max-w-full w-[520px] h-auto rounded-[175px] border-[2px] md:border-[5px] border-solid border-white object-cover"
          style={{ boxShadow: '8px 5px 10px 0px rgba(0, 0, 0, 0.46)' }}
        />
      </Reveal>

      <Reveal variant="fadeInUp" className="mb-[20px]">
        <p className="font-dynalight text-[35px] md:text-[45px] leading-none font-normal text-[#A59071]">
          {person.nickname}
        </p>
      </Reveal>

      <Reveal variant="fadeInUp" className="mb-[20px]">
        <p className="font-montserrat text-[16px] md:text-[18px] leading-[1.7] font-bold text-[#474747]">
          {person.fullName}
        </p>
      </Reveal>

      <Reveal variant="fadeInUp" className="-mt-[15px] md:mt-0 pb-[16px] md:pb-0">
        <p className="font-poppins italic text-[14px] md:text-[15px] leading-[1.7] font-normal text-[#474747]">
          {person.childOrder}
          <br />
          <b className="font-semibold">
            {person.fatherName}
            <br />
            &amp;
            <br />
            {person.motherName}
          </b>
        </p>
      </Reveal>
    </div>
  );
}

export function CoupleSection({ groom, bride }: CoupleSectionProps) {
  return (
    <section data-id="63145f74" className="w-full">
      <div
        className="m-[20px] p-[5px] md:p-[50px] bg-[#FFF8ED] rounded-[25px]"
        style={{ boxShadow: '2px 5px 10px 0px rgba(0, 0, 0, 0.5)' }}
      >
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 items-start">
          <ProfileColumn person={groom} />
          <ProfileColumn person={bride} />
        </div>
      </div>
    </section>
  );
}
