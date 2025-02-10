"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Trophy, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createGame, getGames, getPlayers } from "@/lib/api"
import type { Game, Player } from "@/types"

export function GameManager() {
  const { currentCommunity } = useApp()
  const [games, setGames] = useState<Game[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
    community_id: "",
    status: "active",
    score: [0, 0] as [number, number]
  })

  useEffect(() => {
    if (currentCommunity) {
      loadGames()
      loadPlayers()
    }
  }, [currentCommunity])

  const loadGames = async () => {
    if (!currentCommunity) return
    try {
      const data = await getGames(currentCommunity.id)
      setGames(data as Game[])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadPlayers = async () => {
    if (!currentCommunity) return
    try {
      const data = await getPlayers(currentCommunity.id)
      setPlayers(data as Player[])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleCreateGame = async () => {
    if (!currentCommunity || !newGame.name.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      await createGame({
        ...newGame,
        community_id: currentCommunity.id,
        team1: [],
        team2: []
      })
      
      await loadGames()
      setNewGame({
        name: "",
        description: "",
        community_id: "",
        status: "active",
        score: [0, 0]
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este jogo?")) return
    
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase
        .from("games")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      await loadGames()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!currentCommunity) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Selecione uma comunidade para gerenciar os jogos
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Jogos</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mb-6">
          <Input
            type="text"
            placeholder="Nome do jogo"
            value={newGame.name}
            onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
            disabled={loading}
          />
          <Input
            type="text"
            placeholder="Descrição do jogo (opcional)"
            value={newGame.description}
            onChange={(e) => setNewGame(prev => ({ ...prev, description: e.target.value }))}
            disabled={loading}
          />
          <Button 
            onClick={handleCreateGame} 
            disabled={loading || !newGame.name.trim()}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Jogo
          </Button>
        </div>

        <div className="space-y-3">
          {games.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{game.name}</h4>
                {game.description && (
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteGame(game.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {games.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhum jogo cadastrado ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

