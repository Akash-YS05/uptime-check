import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Inter, Bodoni_Moda } from 'next/font/google'
import './globals.css'
import Appbar from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'

const bodoni_moda = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Status - Website Uptime Monitoring",
  description: "Real-time alerts when your websites experience downtime",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={`${inter.variable} ${bodoni_moda.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Appbar/>
            <Toaster position='bottom-right'/>
            {children}
          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  )
}