import './globals.css';
import { Providers } from './providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Oto Mansuroğlu - Ford Yedek Parça',
  description: 'Ford araçlar için orijinal ve yan sanayi yedek parçalar',
  keywords: 'ford, yedek parça, otomotiv, araba, tamir, bakım',
  authors: [{ name: 'Oto Mansuroğlu' }],
  creator: 'Oto Mansuroğlu',
  publisher: 'Oto Mansuroğlu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://oto-mansuroglu.vercel.app',
    title: 'Oto Mansuroğlu - Ford Yedek Parça',
    description: 'Ford araçlar için orijinal ve yan sanayi yedek parçalar',
    siteName: 'Oto Mansuroğlu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}