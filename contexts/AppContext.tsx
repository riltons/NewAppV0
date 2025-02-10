"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, Community, Competition, Game, Match } from "@/types"
import { supabase } from "@/lib/supabase"

interface AppContextType {
  user: User | null
  communities: Community[]
  competitions: Competition[]
  games: Game[]
  matches: Match[]
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  addCommunity: (community: Community) => void
  addCompetition: (competition: Competition) => void
  addGame: (game: Game) => void
  addMatch: (match: Match) => void
  // Add more functions as needed
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          // Fetch user data, communities, competitions, etc.
          // Update state accordingly
        }
      } catch (err) {
        setError("Failed to fetch initial data")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const addCommunity = (community: Community) => {
    setCommunities((prev) => [...prev, community])
  }

  const addCompetition = (competition: Competition) => {
    setCompetitions((prev) => [...prev, competition])
  }

  const addGame = (game: Game) => {
    setGames((prev) => [...prev, game])
  }

  const addMatch = (match: Match) => {
    setMatches((prev) => [...prev, match])
  }

  const value = {
    user,
    communities,
    competitions,
    games,
    matches,
    loading,
    error,
    setUser,
    addCommunity,
    addCompetition,
    addGame,
    addMatch,
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

