import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serene - Your AI Therapeutic Assistant',
  description: 'A compassionate AI assistant for mental wellness and emotional support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}