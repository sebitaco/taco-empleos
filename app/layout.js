import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Taco Empleos - Encuentra tu próximo trabajo en hostelería',
  description: 'La plataforma líder para encontrar empleos en restaurantes, cafeterías y hoteles en México',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}