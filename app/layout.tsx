import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { AppProvider } from "@/contexts/AppContext" // Import AppProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Domino Manager",
  description: "Gerenciamento de partidas de dominó",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider> {/* Wrap children with AppProvider */}
      </body>
    </html>
  )
}

