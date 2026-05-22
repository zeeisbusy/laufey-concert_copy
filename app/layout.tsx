import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Laufey Live in Jakarta — GBK 2025',
  description: 'Saksikan Laufey tampil memukau di Gelora Bung Karno, Jakarta.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-ink text-cream min-h-screen font-body">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  )
}