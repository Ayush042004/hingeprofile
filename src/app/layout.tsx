import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'AI Dating Profile Coach — Craft Your Perfect Hinge Profile',
  description:
    'An AI-powered dating profile generator that interviews you through natural conversation, then crafts a personalized Hinge profile that actually sounds like you.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-[#F0F0F0] text-[#121212]`}>
        <ClerkProvider afterSignInUrl="/interview" afterSignUpUrl="/interview">
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}