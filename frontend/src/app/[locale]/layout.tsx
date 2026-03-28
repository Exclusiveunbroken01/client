// src/app/[locale]/layout.tsx
//grep -r "/api/" src/
//grep -r "airports" src/
import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import StoreProvider from './StoreProvider';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, locales } from '@/i18n/config';
import { Toaster } from 'sonner';
import { getCachedMessages } from '@/i18n/getCachedMessages';
import { notFound } from 'next/navigation';

const mulish = localFont({
  src: '../../fonts/Mulish/static/Mulish-Regular.ttf',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* -----------------------------------------------------
 * 2️⃣ Locale-aware SEO metadata
 * --------------------------------------------------- */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  return {
    title: {
      en: 'Cunningham | Explore Destinations',
      fr: 'Cunningham | Explorer des destinations',
      de: 'Cunningham | Reiseziele entdecken',
      es: 'Cunningham | Explorar destinos',
    }[typedLocale],
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;
  const messages = await getCachedMessages(typedLocale);

  return (
    <html lang={typedLocale}>
      <body className={`${mulish.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            {children}
            <Toaster position='top-right' />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
