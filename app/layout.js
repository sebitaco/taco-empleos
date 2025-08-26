import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import ErrorBoundary from '@/components/ErrorBoundary'
import ClerkWrapper from '@/components/ClerkWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Taco Empleos - Encuentra tu próximo trabajo en hostelería',
    template: '%s | Taco Empleos'
  },
  description: 'La plataforma líder para encontrar empleos en restaurantes, cafeterías y hoteles en México. Conectamos talento con las mejores oportunidades laborales.',
  keywords: [
    'empleos hostelería México',
    'trabajos restaurantes',
    'empleos hoteles',
    'trabajo mesero',
    'empleos cocinero',
    'barista trabajo',
    'empleos turismo México'
  ],
  authors: [{ name: 'Taco Empleos' }],
  creator: 'Taco Empleos',
  publisher: 'Taco Empleos',
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
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    title: 'Taco Empleos - Encuentra tu próximo trabajo en hostelería',
    description: 'La plataforma líder para encontrar empleos en restaurantes, cafeterías y hoteles en México.',
    siteName: 'Taco Empleos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taco Empleos - Encuentra tu próximo trabajo en hostelería',
    description: 'La plataforma líder para encontrar empleos en restaurantes, cafeterías y hoteles en México.',
    creator: '@tacoempleados',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClerkWrapper>
          <Analytics />
          <ErrorBoundary>
            <Header />
            {children}
            <Footer />
          </ErrorBoundary>
        </ClerkWrapper>
      </body>
    </html>
  )
}