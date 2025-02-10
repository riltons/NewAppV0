"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type { Community, Player } from "@/types"

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  currentCommunity: Community | null
  setCurrentCommunity: (community: Community | null) => void
  currentPlayer: Player | null
  setCurrentPlayer: (player: Player | null) => void
  loading: boolean
  error: string | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Verificar sessão atual
      const initializeAuth = async () => {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          if (sessionError) throw sessionError
          setUser(session?.user ?? null)
        } catch (err: any) {
          console.error('Error getting session:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      initializeAuth()

      // Escutar mudanças de autenticação
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    } catch (err: any) {
      console.error('Error in auth setup:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    setUser,
    currentCommunity,
    setCurrentCommunity,
    currentPlayer,
    setCurrentPlayer,
    loading,
    error,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

