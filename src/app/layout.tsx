import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SaintSal™',
  },
  title: {
    default: 'SaintSal™ - The Everything Platform',
    template: '%s | SaintSal™',
  },
  description: 'AI-powered platform for business intelligence, lending, trading, and more. Built by Saint Vision Technologies.',
  keywords: ['AI', 'business intelligence', 'lending', 'trading', 'SaintSal', 'CookinBiz'],
  authors: [{ name: 'Saint Vision Technologies LLC' }],
  creator: 'Saint Vision Technologies LLC',
  publisher: 'Saint Vision Technologies LLC',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cookinbiz.com',
    siteName: 'SaintSal™',
    title: 'SaintSal™ - The Everything Platform',
    description: 'AI-powered platform for business intelligence, lending, trading, and more.',
    images: [
      {
        url: '/images/TRANSPARENTSAINTSALLOGO.png',
        width: 1200,
        height: 630,
        alt: 'SaintSal™',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaintSal™ - The Everything Platform',
    description: 'AI-powered platform for business intelligence, lending, trading, and more.',
    images: ['/images/TRANSPARENTSAINTSALLOGO.png'],
  },
  icons: {
    icon: '/images/THE_BEST_MAIN_LOGO___COOKIN.png',
    shortcut: '/images/THE_BEST_MAIN_LOGO___COOKIN.png',
    apple: '/images/THE_BEST_MAIN_LOGO___COOKIN.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0f12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Noise texture overlay for premium feel */}
        <div className="noise-overlay" />
        
        {/* Main content */}
        <main className="relative min-h-screen bg-[#0d0f12]">
          {children}
        </main>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(26, 29, 35, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        
        {/* PWA Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
