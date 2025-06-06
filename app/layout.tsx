import type React from "react"
import "./globals.css"
import { Cairo } from 'next/font/google'
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap' })

export const metadata = {
  title: "نظام إدارة عقود الاستثمار",
  description: "نظام متكامل لإدارة عقود الاستثمار والدفعات",
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-gray-50 min-h-screen`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
