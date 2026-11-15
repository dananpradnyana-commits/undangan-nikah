'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GuestComment, InvitationData } from '@/types/invitation';
import { CoverModal } from './CoverModal';
import { HeroSection } from './HeroSection';
import { QuoteSection } from './QuoteSection';
import { CoupleSection } from './CoupleSection';
import { EventSection } from './EventSection';
import { MasonryGallery } from './MasonryGallery';
import { GuestbookSection } from './GuestbookSection';
import { FooterSection } from './FooterSection';
import { AudioPlayerHandle, FloatingAudioPlayer } from './FloatingAudioPlayer';
import { LightboxModal } from './LightboxModal';

interface InvitationClientProps {
  data: InvitationData;
  initialGuestName: string;
  initialComments: GuestComment[];
}

function sanitizeGuestName(raw: string | null | undefined): string {
  if (!raw) return '';
  const cleaned = raw.replace(/\+/g, ' ').replace(/\\(['"\\])/g, '$1').trim();
  return cleaned;
}

export function InvitationClient({
  data,
  initialGuestName,
  initialComments,
}: InvitationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [heroEntered, setHeroEntered] = useState(false);
  const [guestName, setGuestName] = useState(initialGuestName || 'Tamu Undangan');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const audioRef = useRef<AudioPlayerHandle>(null);

  // Sync URL query parameter client-side as well (?to=Krisna, ?dear=..., ?kepada=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl =
      sanitizeGuestName(params.get('to')) ||
      sanitizeGuestName(params.get('dear')) ||
      sanitizeGuestName(params.get('kepada'));
    if (fromUrl) {
      setGuestName(fromUrl);
    }
  }, []);

  const allPhotos = useMemo(
    () => [
      ...data.galleries.part1,
      ...data.galleries.part2,
      ...data.galleries.part3,
      ...data.galleries.part4,
    ],
    [data.galleries]
  );

  const part1Offset = 0;
  const part2Offset = data.galleries.part1.length;
  const part3Offset = part2Offset + data.galleries.part2.length;
  const part4Offset = part3Offset + data.galleries.part3.length;

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // hero entrance starts as the envelope cover dissolves
    window.setTimeout(() => setHeroEntered(true), 1750);
    audioRef.current?.playFromUserGesture();
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Halaman 1: Cover Welcome Modal Overlay */}
      <CoverModal
        guestName={guestName}
        coverPhoto={data.coverPhoto}
        coupleTitle={data.coupleTitle}
        eventDateText={data.event.dayAndDateLines[1]}
        isOpen={isOpen}
        onOpenInvitation={handleOpenInvitation}
      />

      {/* Halaman 2: Main Wedding Invitation Content */}
      <main id="invitation-content" className="w-full">
        {/* 1. Hero Section + Countdown */}
        <HeroSection
          heading={data.heroHeading}
          coupleTitle={data.coupleTitle}
          heroBackground={data.heroBackground}
          eventIsoDate={data.eventIsoDate}
          entered={heroEntered}
          dateText={data.event.dayAndDateLines[1]}
        />

        {/* 2. Sacred Rg Veda X.85.42 Sloka */}
        <QuoteSection
          sanskrit={data.sloka.sanskrit}
          source={data.sloka.source}
          translation={data.sloka.translation}
        />

        {/* 3. Groom & Bride Profiles */}
        <CoupleSection groom={data.groom} bride={data.bride} />

        {/* 4. Acara Kami (Date, Time, Venue & Google Maps) */}
        <EventSection
          title={data.event.title}
          dayAndDateLines={data.event.dayAndDateLines}
          timeText={data.event.timeText}
          venueMain={data.event.venueMain}
          venueSub={data.event.venueSub}
          mapUrl={data.event.mapUrl}
          background={data.event.background}
        />

        {/* 5. Galeri Wedding Part 1 + Galeri Part 2 */}
        <MasonryGallery
          sectionId="gallery-part-1"
          title="Galeri Wedding"
          photos={data.galleries.part1}
          startIndex={part1Offset}
          onSelectPhoto={setActivePhotoIndex}
        />
        <MasonryGallery
          sectionId="gallery-part-2"
          photos={data.galleries.part2}
          startIndex={part2Offset}
          onSelectPhoto={setActivePhotoIndex}
        />

        {/* 6. Buku Tamu (Wishes & RSVP Confirmation) */}
        <GuestbookSection initialComments={initialComments} defaultGuestName={guestName} />

        {/* 7. Galeri Part 3 */}
        <MasonryGallery
          sectionId="gallery-part-3"
          photos={data.galleries.part3}
          startIndex={part3Offset}
          onSelectPhoto={setActivePhotoIndex}
        />

        {/* 8. Galeri Part 4 */}
        <MasonryGallery
          sectionId="gallery-part-4"
          photos={data.galleries.part4}
          startIndex={part4Offset}
          onSelectPhoto={setActivePhotoIndex}
        />

        {/* 11 & 12. Couple Banner with Wave Divider + Black Vendor Footer */}
        <FooterSection
          coupleTitle={data.coupleTitle}
          bannerBackground={data.closing.bannerBackground}
          monogramLogo={data.closing.monogramLogo}
          vendorLogo={data.footer.vendorLogo}
          instagramUrl={data.footer.instagramUrl}
          whatsappUrl={data.footer.whatsappUrl}
          copyrightText={data.footer.copyrightText}
          copyrightUrl={data.footer.copyrightUrl}
        />
      </main>

      {/* Floating Background Music Control */}
      <FloatingAudioPlayer ref={audioRef} audioSrc={data.audioSrc} visible={isOpen} />

      {/* Full-Screen 20-Photo Lightbox */}
      <LightboxModal
        photos={allPhotos}
        activeIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onChangeIndex={setActivePhotoIndex}
      />
    </div>
  );
}
