"use client"

import { Suspense } from "react"
import Header from "@/components/Header"
import Navigation from "@/components/Navigation"
import Dashboard from "@/components/Dashboard"
import { CommunityManager } from "@/components/CommunityManager"
import { PlayerManager } from "@/components/PlayerManager"
import { CompetitionManager } from "@/components/CompetitionManager"
import { GameManager } from "@/components/GameManager"
import { Auth } from "@/components/Auth"
import { Toaster } from "@/components/ui/toaster"
import { useApp } from "@/contexts/AppContext"

export default function Home() {
  const { user, loading } = useApp()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Auth />
  }

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navigation />
        <div className="flex-1 p-6 overflow-y-auto">
          <Suspense fallback={<div>Carregando...</div>}>
            <Dashboard />
          </Suspense>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <CommunityManager />
            <PlayerManager />
            <CompetitionManager />
            <GameManager />
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

