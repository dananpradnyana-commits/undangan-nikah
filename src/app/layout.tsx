import type { Metadata } from 'next';
import {
  Lora,
  Dynalight,
  Crete_Round,
  Montserrat,
  Poppins,
  Roboto,
  Playfair_Display,
  Open_Sans,
} from 'next/font/google';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

const dynalight = Dynalight({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dynalight',
  display: 'swap',
});

const creteRound = Crete_Round({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-crete-round',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-playfair',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pawiwahan Gus Eka & Dek Tini',
  description: 'Undangan Pawiwahan Gus Eka & Dek Tini, Jumat 20 November 2026',
  icons: {
    icon: [
      { url: '/seo/et-icon-32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/seo/et-icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/seo/et-icon-192.png?v=2',
  },
  openGraph: {
    title: 'Pawiwahan Gus Eka & Dek Tini',
    description: 'Undangan Pawiwahan Gus Eka & Dek Tini, Jumat 20 November 2026',
    images: [{ url: '/images/og-thumb.jpg', width: 1200, height: 630 }],
    type: 'article',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${lora.variable} ${dynalight.variable} ${creteRound.variable} ${montserrat.variable} ${poppins.variable} ${roboto.variable} ${playfair.variable} ${openSans.variable}`}
    >
      <body className="antialiased selection:bg-[#A48C4D]/25 selection:text-[#474747]">
        {children}
      </body>
    </html>
  );
}
