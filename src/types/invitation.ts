export interface GalleryPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface GuestComment {
  id: number;
  author: string;
  message: string;
  attendance?: string;
  date: string;
  relativeTime?: string;
}

export interface PersonProfile {
  nickname: string;
  fullName: string;
  photo: string;
  childOrder: string;
  fatherName: string;
  motherName: string;
  address: string;
}

export interface InvitationData {
  coupleTitle: string;
  heroHeading: string;
  eventIsoDate: string;
  coverPhoto: string;
  coverBackground: string;
  heroBackground: string;
  audioSrc: string;
  sloka: {
    sanskrit: string;
    source: string;
    translation: string;
  };
  groom: PersonProfile;
  bride: PersonProfile;
  event: {
    title: string;
    dayAndDateLines: [string, string];
    timeText: string;
    venueMain: string;
    venueSub: string;
    mapUrl: string;
    background: string;
  };
  galleries: {
    part1: GalleryPhoto[];
    video1Id: string;
    part2: GalleryPhoto[];
    part3: GalleryPhoto[];
    video2Id: string;
    part4: GalleryPhoto[];
    video3Id: string;
  };
  shareMoment: {
    title: string;
    description: string;
    instagramFilterUrl: string;
    facebookFilterUrl: string;
    photo: string;
  };
  closing: {
    title: string;
    subtitle: string;
    photo: string;
    bannerBackground: string;
    monogramLogo: string;
  };
  footer: {
    vendorLogo: string;
    instagramUrl: string;
    whatsappUrl: string;
    copyrightText: string;
    copyrightUrl: string;
  };
}
