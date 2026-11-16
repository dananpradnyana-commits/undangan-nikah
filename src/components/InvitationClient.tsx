'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GuestComment, InvitationData } from '@/types/invitation';
import { CoverModal } from './CoverModal';
import { HeroSection } from './HeroSection';
import { QuoteSection } from './QuoteSection';
import { CoupleSection } from './CoupleSection';
import { EventSection } from './EventSection';
import { MasonryGallery } from './MasonryGallery';
import { PhotoCollage } from './PhotoCollage';
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

// Slideshow under the Rg Veda: 9 portrait couple photos centered at 50%, mixed so adjacent slides never look alike
const SLIDESHOW_IDS = [
  'g4-1',
  'g4-4',
  'g1-5',
  'g2-5',
  'g2-6',
  'g3-3',
  'g1-6',
  'g2-4',
  'g2-3',
];

// Abstract collage near the end: 7 distinct couple photos with varied compositions and zero adjacent similar poses
const COLLAGE_IDS = ['g1-3', 'g2-1', 'g3-1', 'g4-3', 'g2-2', 'g3-4', 'g1-4'];

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

  const [gallery1Photos, gallery2Photos] = useMemo(() => {
    const all = [
      ...data.galleries.part1,
      ...data.galleries.part2,
      ...data.galleries.part3,
      ...data.galleries.part4,
    ];
    const byId = new Map(all.map((p) => [p.id, p]));
    const pick = (ids: string[]) =>
      ids.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    return [pick(SLIDESHOW_IDS), pick(COLLAGE_IDS)];
  }, [data.galleries]);

  const allPhotos = useMemo(
    () => [...gallery1Photos, ...gallery2Photos],
    [gallery1Photos, gallery2Photos]
  );

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

        {/* 3. Galeri Slideshow (setelah Rg Veda) */}
        <MasonryGallery
          sectionId="gallery-part-1"
          title="Galeri Wedding"
          photos={gallery1Photos}
          startIndex={0}
          onSelectPhoto={setActivePhotoIndex}
          showThumbs={true}
        />

        {/* 4. Groom & Bride Profiles */}
        <CoupleSection groom={data.groom} bride={data.bride} />

        {/* 5. Acara Kami (Date, Time, Venue & Google Maps) */}
        <EventSection
          title={data.event.title}
          dayAndDateLines={data.event.dayAndDateLines}
          timeText={data.event.timeText}
          venueMain={data.event.venueMain}
          venueSub={data.event.venueSub}
          mapUrl={data.event.mapUrl}
          background={data.event.background}
        />

        {/* 6. Buku Tamu (Wishes & RSVP Confirmation) */}
        <GuestbookSection initialComments={initialComments} defaultGuestName={guestName} />

        {/* 7. Galeri Kolase Abstrak (sebelum bagian akhir) */}
        <PhotoCollage
          sectionId="gallery-part-2"
          title="Momen Bahagia"
          photos={gallery2Photos}
          startIndex={gallery1Photos.length}
          onSelectPhoto={setActivePhotoIndex}
        />

        {/* 8. Couple Banner + Closing Footer */}
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

      {/* Full-Screen Photo Lightbox */}
      <LightboxModal
        photos={allPhotos}
        activeIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onChangeIndex={setActivePhotoIndex}
      />
    </div>
  );
}
