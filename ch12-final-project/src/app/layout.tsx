import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Khizar\'s Portfolio',
  description: 'Created by Khizar Amin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-800">
        <Navbar />
        <main className="px-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
        {children}
        </main>
      </body>
    </html>
  )
}
